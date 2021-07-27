import { ISessionContext } from '@jupyterlab/apputils'
import { Kernel, KernelMessage, Contents, ServiceManager } from '@jupyterlab/services'
import { JSONValue, UUID } from '@lumino/coreutils'
import { Signal } from '@lumino/signaling'
import { IDisposable } from '@lumino/disposable'
import { ReadinessProbe } from './readinessProbe'
import {
  IBackEndContext,
  MessageEnvelope,
  ModuleViewProvider,
  Target,
  DynamicModuleViewProvider
} from '@dharpa-vre/client-core'
import { DefaultModuleComponentPanel } from '@dharpa-vre/client-ui'

import { registerTestModules } from '@dharpa-vre/modules'

registerTestModules()

export class KernelModuleContext implements IBackEndContext, IDisposable {
  private _contextId: string

  private _sessionContext: ISessionContext
  private _probe: ReadinessProbe

  // if a target is used, all records below have values for it unless comm got
  // closed by kernel. In this case only signal will exist.
  private _comms: Record<string, Kernel.IComm> = {}
  private _commReadyPromises: Record<string, Promise<Kernel.IComm>> = {}
  private _signals: Record<string, Signal<KernelModuleContext, MessageEnvelope<unknown>>> = {}

  private _services: ServiceManager.IManager
  private _moduleViewProvider: DynamicModuleViewProvider

  constructor(session: ISessionContext, serviceManager: ServiceManager.IManager) {
    this._contextId = UUID.uuid4()
    this._sessionContext = session
    this._probe = new ReadinessProbe(session)

    this._moduleViewProvider = new DynamicModuleViewProvider(DefaultModuleComponentPanel)

    this._probe.readinessChanged.connect((_, isReady) => {
      if (isReady) this._reinitialiseComms()
    })
    this._services = serviceManager
  }
  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void {
    this._probe.readinessChanged.connect((_, isReady) => callback(isReady))
  }

  readonly isDisposed = false
  dispose(): void {
    Object.keys(this._signals).forEach(target => {
      if (target in this._comms) {
        delete this._comms[target]
        delete this._comms[target]
      }
      delete this._signals[target]
    })
  }

  get isAvailable(): boolean {
    return this._probe.isReady
  }

  async sendMessage<T, U>(target: Target, msg: MessageEnvelope<T>): Promise<U> {
    const [, comm] = await this._ensureTargetReady(target)
    console.log(`Sending message on ${target}`, msg)
    const response = await comm.send((msg as unknown) as JSONValue).done
    return response?.content as U
  }
  async subscribe<T>(
    target: Target,
    callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void
  ): Promise<void> {
    const [signal] = await this._ensureTargetReady<T>(target)
    if (signal == null) throw new Error(`Target not supported: ${target}`)

    signal.connect(callback)
  }
  async unsubscribe<T>(
    target: Target,
    callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void
  ): Promise<void> {
    const [signal] = await this._ensureTargetReady<T>(target)
    if (signal == null) throw new Error(`Target not supported: ${target}`)

    signal.disconnect(callback)
  }

  private async _ensureTargetReady<T>(
    target: Target
  ): Promise<[Signal<KernelModuleContext, MessageEnvelope<T>>, Kernel.IComm]> {
    const comm = await this._getComm(target)
    const signal = this._signals[target] as Signal<KernelModuleContext, MessageEnvelope<T>>

    return [signal, comm]
  }

  private async _getComm(target: Target): Promise<Kernel.IComm> {
    const commId = `${this._contextId}:${target}`

    if (!(target in this._comms)) {
      // set up signal, comm and comm ready promise

      // 1. signal
      if (!(target in this._signals))
        this._signals[target] = new Signal<KernelModuleContext, MessageEnvelope<unknown>>(this)

      // 2. comm
      if (this.kernelConnection.hasComm(commId))
        throw new Error(`Comm "${commId}" already exists in Kernel. This should not happen.`)

      const comm = this.kernelConnection.createComm(target, commId)
      this._comms[target] = comm

      comm.onClose = (msg: KernelMessage.ICommCloseMsg) => {
        if (target in this._comms) delete this._comms[target]
        if (target in this._commReadyPromises) delete this._commReadyPromises[target]
        console.log(`Comm "${commId}" has been closed by backend`, msg)
      }
      comm.onMsg = (msg: KernelMessage.ICommMsgMsg) => {
        console.log(`Received message on ${target}`, msg?.content?.data)
        const data = msg.content.data
        signal.emit((data as unknown) as MessageEnvelope<unknown>)
      }

      this._commReadyPromises[target] = this._probe.readyPromise
        .then(() => this.kernelConnection.requestCommInfo({ target_name: target }))
        .then(response => {
          const comms = (response.content as KernelMessage.ICommInfoReply)?.comms ?? {}
          // The comm is already set up with the backend, no need to open it.
          if (commId in comms) return comm
          // It is not set up yet - open the comm
          return comm.open().done.then(() => comm)
        })
    }

    const signal = this._signals[target]
    const readyPromise = this._commReadyPromises[target]

    const comm = await readyPromise

    if (comm.isDisposed) throw new Error(`Comm for ${target} is disposed prematurely`)

    return comm
  }

  private async _reinitialiseComms(): Promise<void> {
    this._sessionContext.session?.anyMessage.connect((_, msg) => this._kernelStreamPrinter(msg))
    Object.keys(this._signals).forEach(async target => {
      if (!(target in this._comms)) {
        await this._getComm(target as Target)
      } else {
        const comm = this._comms[target]
        if (comm.isDisposed || !this.kernelConnection.hasComm(comm.commId)) {
          if (target in this._comms) delete this._comms[target]
          if (target in this._commReadyPromises) delete this._commReadyPromises[target]
          await this._getComm(target as Target)
        }
      }
    })
  }

  private _kernelStreamPrinter(msg: Kernel.IAnyMessageArgs) {
    if (msg.direction === 'recv' && msg.msg.header.msg_type === 'stream') {
      const { name, text } = msg.msg.content as Record<string, string>
      console.debug(`[Backend ${name}]: ${text}`)
    }
  }

  get kernelConnection(): Kernel.IKernelConnection {
    return this._sessionContext.session?.kernel
  }

  get moduleViewProvider(): ModuleViewProvider {
    return this._moduleViewProvider
  }

  addFilesToRepository(files: File[]): Promise<void> {
    // TODO: In electron we have access to full file path - we don't need to upload anything.
    return Promise.all(files.map(file => this._uploadFileInBrowser(file))).then(() => undefined)
  }

  /**
   * Code adopted from here: https://github.com/jupyterlab/jupyterlab/blob/master/packages/filebrowser/src/model.ts#L461
   *
   * NOTE: At the moment does not handle large files! Use chunked upload from the code in the link above.
   */
  async _uploadFileInBrowser(file: File): Promise<void> {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    await new Promise((resolve, reject) => {
      reader.onload = resolve
      reader.onerror = event => reject(`Failed to upload "${file.name}":` + event)
    })

    // remove header https://stackoverflow.com/a/24289420/907060
    const content = (reader.result as string).split(',')[1]
    const type: Contents.ContentType = 'file'
    const format: Contents.FileFormat = 'base64'
    const name = file.name
    const chunk = 0

    // TODO: get temporary directory from settings
    const path = `./tmp/${file.name}`

    const model: Partial<Contents.IModel> = {
      type,
      format,
      name,
      chunk,
      content
    }
    return this._services.contents.save(path, model).then(() => undefined)
  }
}
