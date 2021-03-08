import { Signal } from '@lumino/signaling'

import {
  IBackEndContext,
  Target,
  DataContainer,
  ModuleDataMessages,
  ModuleParametersMessages,
  WorkflowMessages,
  MessageEnvelope,
  Workflow
} from '@dharpa-vre/client-core'

export type DataProcessor<P, I, O> = (moduleId: string, moduleParameters: P) => Promise<DataContainer<I, O>>

export interface MockContextParameters<P, I, O> {
  processData: DataProcessor<P, I, O>
  currentWorkflow?: Workflow
  startupDelayMs?: number
}

export class MockContext<P, I, O> implements IBackEndContext {
  private _isDisposed = false
  private _store: Storage
  private _processData: DataProcessor<P, I, O>

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext<P, I, O>, boolean>(this)

  private _moduleParametersSignal = new Signal<MockContext<P, I, O>, ModuleParametersMessages.Updated<P>>(
    this
  )
  private _moduleDataPreviewSignal = new Signal<MockContext<P, I, O>, ModuleDataMessages.Updated<I, O>>(this)
  private _workflowSignal = new Signal<MockContext<P, I, O>, WorkflowMessages.Updated>(this)
  private _activitySignal = new Signal<MockContext<P, I, O>, void>(this)

  private _mostRecentParameters: ModuleParametersMessages.Updated<P>
  private _currentWorkflow: Workflow

  constructor(parameters?: MockContextParameters<P, I, O>) {
    this._store = window.localStorage
    this._processData = parameters?.processData
    this._currentWorkflow = parameters?.currentWorkflow

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

  private async _handleGetModuleParameters(moduleId: string) {
    const value = this._store.getItem(`${moduleId}:${Target.ModuleParameters}`)
    const workflowParameters = (this._currentWorkflow?.structure?.steps?.find(step => step.id === moduleId)
      ?.parameters as unknown) as P

    const parameters = value != null ? (JSON.parse(value) as P) : workflowParameters
    const response: ModuleParametersMessages.Updated<P> = {
      action: 'updated',
      content: {
        id: moduleId,
        parameters
      }
    }

    this._moduleParametersSignal.emit(response)
    return response
  }

  private async _handleUpdateModuleParameters(updateMessage: ModuleParametersMessages.Update<P>) {
    const { parameters, id: moduleId } = updateMessage.content
    this._store.setItem(`${moduleId}:${Target.ModuleParameters}`, JSON.stringify(parameters))

    const response: ModuleParametersMessages.Updated<P> = {
      action: 'updated',
      content: {
        id: moduleId,
        parameters
      }
    }

    // fake data processing
    if (this._processData != null) {
      return this._processData(moduleId, parameters)
        .then(dataContainer => {
          const response: ModuleDataMessages.Updated<I, O> = {
            action: 'updated',
            content: dataContainer
          }
          return this._moduleDataPreviewSignal.emit(response)
        })
        .then(() => response)
    } else return Promise.resolve(response)
  }

  private async _handleGetModuleIOPreview(moduleId: string) {
    // fake data processing
    if (this._processData != null) {
      return this._processData(moduleId, this._mostRecentParameters?.content?.parameters).then(
        dataContainer => {
          const response: ModuleDataMessages.Updated<I, O> = {
            action: 'updated',
            content: dataContainer
          }
          return this._moduleDataPreviewSignal.emit(response)
        }
      )
    }
  }

  sendMessage<T, U>(target: Target, msg: MessageEnvelope<T>): Promise<U> {
    const { action } = msg
    const coerce = <T>(v: T) => (v as unknown) as U

    if (target === Target.ModuleParameters) {
      if (action === 'get') {
        const {
          content: { id: moduleId }
        } = (msg as unknown) as ModuleParametersMessages.Get
        return this._handleGetModuleParameters(moduleId).then(coerce)
      } else if (action === 'update') {
        return this._handleUpdateModuleParameters(
          (msg as unknown) as ModuleParametersMessages.Update<P>
        ).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.ModuleIOPreview) {
      if (action === 'get') {
        const {
          content: { moduleId }
        } = (msg as unknown) as ModuleDataMessages.GetPreview
        return this._handleGetModuleIOPreview(moduleId).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.Workflow) {
      if (action === 'get') {
        const msg: WorkflowMessages.Updated = {
          action: 'updated',
          content: {
            workflow: this._currentWorkflow
          }
        }
        this._workflowSignal.emit(msg)
        return
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    }

    throw new Error(`Target not supported: ${target}`)
  }

  private _getSignal<T>(target: Target): Signal<MockContext<P, I, O>, T> {
    if (target === Target.ModuleParameters) {
      return (this._moduleParametersSignal as unknown) as Signal<MockContext<P, I, O>, T>
    } else if (target === Target.ModuleIOPreview) {
      return (this._moduleDataPreviewSignal as unknown) as Signal<MockContext<P, I, O>, T>
    } else if (target === Target.Workflow) {
      return (this._workflowSignal as unknown) as Signal<MockContext<P, I, O>, T>
    } else if (target === Target.Activity) {
      return (this._activitySignal as unknown) as Signal<MockContext<P, I, O>, T>
    }
    throw new Error(`Target "${target}" has not been implemented in mock yet.`)
  }

  subscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void {
    const signal = this._getSignal<MessageEnvelope<T>>(target)
    if (signal == null) throw new Error(`Target not supported: ${target}`)

    signal.connect(callback)
  }

  unsubscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void {
    const signal = this._getSignal<MessageEnvelope<T>>(target)
    if (signal == null) throw new Error(`Target not supported: ${target}`)

    signal.disconnect(callback)
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
