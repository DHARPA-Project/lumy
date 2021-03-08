import { ISessionContext } from '@jupyterlab/apputils'
import { Kernel, KernelMessage } from '@jupyterlab/services'
import { JSONValue, UUID } from '@lumino/coreutils'
import { Signal } from '@lumino/signaling'
import { IDisposable } from '@lumino/disposable'
import { ReadinessProbe } from './readinessProbe'
import { IBackEndContext, MessageEnvelope, ModuleViewProvider, Target } from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

export class KernelModuleContext implements IBackEndContext, IDisposable {
  private _contextId: string

  private _sessionContext: ISessionContext
  private _probe: ReadinessProbe

  // if a target is used, all records below have values for it unless comm got
  // closed by kernel. In this case only signal will exist.
  private _comms: Record<string, Kernel.IComm> = {}
  private _commReadyPromises: Record<string, Promise<Kernel.IComm>> = {}
  private _signals: Record<string, Signal<KernelModuleContext, MessageEnvelope<unknown>>> = {}

  constructor(session: ISessionContext) {
    this._contextId = UUID.uuid4()
    this._sessionContext = session
    this._probe = new ReadinessProbe(session)

    this._probe.readinessChanged.connect((_, isReady) => {
      if (isReady) this._reinitialiseComms()
    })
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
        console.log(`Received message on ${target}`, msg)
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
    return viewProvider
  }
}
