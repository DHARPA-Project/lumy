import { ISessionContext } from '@jupyterlab/apputils'
import { Kernel, KernelMessage } from '@jupyterlab/services'
import { IMimeBundle } from '@jupyterlab/nbformat'
import { Signal } from '@lumino/signaling'
import { JSONObject } from '@lumino/coreutils'

export enum ReadinessStatus {
  NotReady = 0,
  KernelReady = 1,
  BackEndReady = 2
}

const BackEndReadyCheckCode = 'Context.getInstance().is_ready'

const BackEndStartCode = `
  from dharpa.vre.jupyter.context import Context
  Context.start()
`

const isKernelReady = (status: Kernel.Status): boolean => ['idle', 'busy'].includes(status)

export class ReadinessProbe {
  private _sessionContext: ISessionContext

  private _checkCode: string
  private _startCode: string

  private _isBackEndCheckRunning = false

  private _status = ReadinessStatus.NotReady
  private _statusChanged = new Signal<ReadinessProbe, ReadinessStatus>(this)
  private _readinessChanged = new Signal<ReadinessProbe, boolean>(this)

  constructor(
    sessionContext: ISessionContext,
    checkCode = BackEndReadyCheckCode,
    startCode = BackEndStartCode
  ) {
    this._sessionContext = sessionContext

    this._checkCode = checkCode
    this._startCode = startCode

    // always changing current status via signal
    this._statusChanged.connect((_, status) => {
      this._status = status
    })

    // listen to kernel status changes
    this._sessionContext.statusChanged.connect(this._handleSessionStatusChanged, this)

    // start backend readiness checks only when status changes to "kernel ready"
    // either from 'not ready' or from 'backend ready'
    this._statusChanged.connect((_, status) => {
      if (status == ReadinessStatus.KernelReady) {
        this._startRequest().then(() => this._maybeSendBackendCheckRequest())
      }
      this._readinessChanged.emit(status >= ReadinessStatus.BackEndReady)
    })

    // initial status
    this._statusChanged.emit(
      isKernelReady(this._sessionContext.kernelDisplayStatus as Kernel.Status)
        ? ReadinessStatus.KernelReady
        : ReadinessStatus.NotReady
    )

    this._sessionContext.iopubMessage.connect((_, message) => {
      const messageType = message.header.msg_type
      if (messageType === 'status') {
        const state = (message as KernelMessage.IStatusMsg)?.content?.execution_state
        if (state === 'idle') {
          this._maybeSendBackendCheckRequest()
        }
      }
    })
  }

  private _handleSessionStatusChanged(context: ISessionContext, status: Kernel.Status) {
    if (!isKernelReady(status)) {
      this._statusChanged.emit(ReadinessStatus.NotReady)
    } else {
      if (this.status < ReadinessStatus.KernelReady) this._statusChanged.emit(ReadinessStatus.KernelReady)
    }
  }

  private async _maybeSendBackendCheckRequest(): Promise<void> {
    if (this.status !== ReadinessStatus.KernelReady) return
    if (this._isBackEndCheckRunning) return

    this._isBackEndCheckRunning = true
    await this._sessionContext.session.kernel
      .requestExecute({
        code: '',
        silent: true,
        store_history: false,
        user_expressions: {
          isBackEndReady: this._checkCode
        }
      })
      .done.then(response => {
        const { user_expressions = {} } = response?.content as KernelMessage.IExecuteReply
        const isReadyBundle = (user_expressions?.isBackEndReady as JSONObject)?.data as IMimeBundle
        const status = (user_expressions?.isBackEndReady as JSONObject)?.status as string
        const isReady = isReadyBundle?.['text/plain'] === 'True' && status === 'ok'
        if (isReady) this._statusChanged.emit(ReadinessStatus.BackEndReady)
      })
      .catch(e => {
        // TODO: handle errors like this
        console.error(`Error occured while trying to get backend readiness status: ${e}`)
        throw e
      })
      .finally(() => {
        this._isBackEndCheckRunning = false
      })
  }

  private async _startRequest(): Promise<void> {
    await this._sessionContext.session.kernel
      .requestExecute({
        code: this._startCode,
        silent: true,
        store_history: false
      })
      .done.then(response => {
        // TODO: handle errors like this
        console.log('Start backend response: ', response.content)
      })
  }

  get status(): ReadinessStatus {
    return this._status
  }

  reportBackEndNotReady(): void {
    if (this.status > ReadinessStatus.KernelReady) this._statusChanged.emit(ReadinessStatus.KernelReady)
  }

  get readyPromise(): Promise<void> {
    return new Promise(resolve => {
      if (this.status >= ReadinessStatus.BackEndReady) return resolve()

      const callback = (_: unknown, status: ReadinessStatus) => {
        if (status >= ReadinessStatus.BackEndReady) {
          this._statusChanged.disconnect(callback)
          resolve()
        }
      }
      this._statusChanged.connect(callback)
    })
  }

  get isReady(): boolean {
    return this.status >= ReadinessStatus.BackEndReady
  }

  get readinessChanged(): Signal<ReadinessProbe, boolean> {
    return this._readinessChanged
  }
}
