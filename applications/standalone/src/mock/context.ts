import { Signal } from '@lumino/signaling'

import {
  IModuleContext,
  Target,
  IMessageWithAction,
  DataContainer,
  ModuleDataMessages,
  ModuleParametersMessages
} from '@dharpa-vre/client-core'

export type DataProcessor<P, I, O> = (moduleParameters: P) => Promise<DataContainer<I, O>>

export interface MockContextParameters<P, I, O> {
  processData: DataProcessor<P, I, O>
  startupDelayMs?: number
}

export class MockContext<P, I, O> implements IModuleContext {
  private _isDisposed = false
  private _moduleId: string
  private _store: Storage
  private _processData: DataProcessor<P, I, O>

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext<P, I, O>, boolean>(this)

  private _moduleParametersSignal = new Signal<MockContext<P, I, O>, ModuleParametersMessages.Updated<P>>(
    this
  )
  private _moduleDataPreviewSignal = new Signal<MockContext<P, I, O>, ModuleDataMessages.Updated<I, O>>(this)

  private _mostRecentParameters: ModuleParametersMessages.Updated<P>

  constructor(moduleId: string, parameters?: MockContextParameters<P, I, O>) {
    this._moduleId = moduleId
    this._store = window.localStorage
    this._processData = parameters?.processData

    this._moduleParametersSignal.connect(this._handleParametersUpdated, this)

    setTimeout(() => {
      this._isReady = true
      this._statusChangedSignal.emit(this._isReady)
    }, parameters?.startupDelayMs ?? 0)
  }

  private _handleParametersUpdated(_: MockContext<P, I, O>, parameters: ModuleParametersMessages.Updated<P>) {
    this._mostRecentParameters = parameters
  }

  get isDisposed(): boolean {
    return this._isDisposed
  }

  dispose(): void {
    this._moduleParametersSignal.disconnect(this._handleParametersUpdated, this)
    this._isDisposed = true
  }

  private async _handleGetModuleParameters() {
    const value = this._store.getItem(`${this.moduleId}:${Target.ModuleParameters}`)
    const parameters = value != null ? (JSON.parse(value) as P) : null
    if (parameters != null) {
      const response: ModuleParametersMessages.Updated<P> = {
        action: 'updated',
        moduleId: this.moduleId,
        parameters
      }

      this._moduleParametersSignal.emit(response)
      return response
    }
  }

  private async _handleUpdateModuleParameters(updateMessage: ModuleParametersMessages.Update<P>) {
    const { moduleParameters, moduleId } = updateMessage
    if (moduleId !== this.moduleId)
      throw new Error(
        `Updating parameters for module "${moduleId}" using context of module "${this.moduleId}"`
      )
    this._store.setItem(`${this.moduleId}:${Target.ModuleParameters}`, JSON.stringify(moduleParameters))

    const response: ModuleParametersMessages.Updated<P> = {
      action: 'updated',
      moduleId: this.moduleId,
      parameters: moduleParameters
    }

    // fake data processing
    if (this._processData != null) {
      return this._processData(moduleParameters)
        .then(dataContainer => {
          const response: ModuleDataMessages.Updated<I, O> = {
            ...dataContainer,
            moduleId: this.moduleId,
            action: 'updated'
          }
          return this._moduleDataPreviewSignal.emit(response)
        })
        .then(() => response)
    } else return Promise.resolve(response)
  }

  private async _handleGetModuleIOPreview() {
    // fake data processing
    if (this._processData != null) {
      return this._processData(this._mostRecentParameters?.parameters).then(dataContainer => {
        const response: ModuleDataMessages.Updated<I, O> = {
          ...dataContainer,
          moduleId: this.moduleId,
          action: 'updated'
        }
        return this._moduleDataPreviewSignal.emit(response)
      })
    }
  }

  sendMessage<T extends IMessageWithAction, U extends IMessageWithAction>(
    target: Target,
    msg: T
  ): Promise<U> {
    const { action } = msg
    const coerce = <T>(v: T) => (v as unknown) as U

    if (target === Target.ModuleParameters) {
      if (action === 'get') {
        return this._handleGetModuleParameters().then(coerce)
      } else if (action === 'update') {
        return this._handleUpdateModuleParameters(
          (msg as unknown) as ModuleParametersMessages.Update<P>
        ).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.ModuleIOPreview) {
      if (action === 'get') {
        return this._handleGetModuleIOPreview().then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    }

    throw new Error(`Target not supported: ${target}`)
  }

  private _getSignal<T extends IMessageWithAction>(target: Target): Signal<MockContext<P, I, O>, T> {
    if (target === Target.ModuleParameters) {
      return (this._moduleParametersSignal as unknown) as Signal<MockContext<P, I, O>, T>
    } else if (target === Target.ModuleIOPreview) {
      return (this._moduleDataPreviewSignal as unknown) as Signal<MockContext<P, I, O>, T>
    }
  }

  subscribe<T extends IMessageWithAction>(
    target: Target,
    callback: (ctx: IModuleContext, msg: T) => void
  ): void {
    const signal = this._getSignal<T>(target)
    if (signal == null) throw new Error(`Target not supported: ${target}`)

    signal.connect(callback)
  }

  unsubscribe<T extends IMessageWithAction>(
    target: Target,
    callback: (ctx: IModuleContext, msg: T) => void
  ): void {
    const signal = this._getSignal<T>(target)
    if (signal == null) throw new Error(`Target not supported: ${target}`)

    signal.disconnect(callback)
  }

  get moduleId(): string {
    return this._moduleId
  }

  get isAvailable(): boolean {
    return this._isReady
  }

  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void {
    this._statusChangedSignal.connect((ctx: MockContext<P, I, O>, isAvailable: boolean) =>
      callback(isAvailable)
    )
  }
}
