import { Signal } from '@lumino/signaling'

import {
  IBackEndContext,
  Target,
  ModuleParametersMessages,
  WorkflowMessages,
  MessageEnvelope,
  Workflow,
  ModuleViewProvider,
  Messages,
  ModuleIOMessages
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

export type DataProcessorResult = Omit<Messages.ModuleIO.PreviewUpdated, 'id'>

export type DataProcessor<P> = (moduleId: string, moduleParameters: P) => Promise<DataProcessorResult>

export interface MockContextParameters<P> {
  processData: DataProcessor<P>
  currentWorkflow?: Workflow
  startupDelayMs?: number
}

export class MockContext<P> implements IBackEndContext {
  private _isDisposed = false
  private _store: Storage
  private _processData: DataProcessor<P>

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext<P>, boolean>(this)

  private _moduleParametersSignal = new Signal<MockContext<P>, ModuleParametersMessages.Updated<P>>(this)
  private _moduleDataPreviewSignal = new Signal<MockContext<P>, ModuleIOMessages.PreviewUpdated>(this)
  private _workflowSignal = new Signal<MockContext<P>, WorkflowMessages.Updated>(this)
  private _activitySignal = new Signal<MockContext<P>, void>(this)

  private _mostRecentParameters: ModuleParametersMessages.Updated<P>
  private _currentWorkflow: Workflow

  constructor(parameters?: MockContextParameters<P>) {
    this._store = window.localStorage
    this._processData = parameters?.processData
    this._currentWorkflow = parameters?.currentWorkflow

    this._moduleParametersSignal.connect(this._handleParametersUpdated, this)

    setTimeout(() => {
      this._isReady = true
      this._statusChangedSignal.emit(this._isReady)
    }, parameters?.startupDelayMs ?? 0)
  }

  private _handleParametersUpdated(_: MockContext<P>, parameters: ModuleParametersMessages.Updated<P>) {
    this._mostRecentParameters = parameters
  }

  get isDisposed(): boolean {
    return this._isDisposed
  }

  dispose(): void {
    this._moduleParametersSignal.disconnect(this._handleParametersUpdated, this)
    this._isDisposed = true
  }

  private _getModuleIdForStep(stepId: string): string {
    const step = this._currentWorkflow.structure.steps.find(step => step.id === stepId)
    return step?.moduleId
  }

  private async _handleGetModuleParameters(moduleId: string) {
    const value = this._store.getItem(`${moduleId}:${Target.ModuleParameters}`)
    const workflowParameters = (this._currentWorkflow?.structure?.steps?.find(step => step.id === moduleId)
      ?.parameters as unknown) as P

    const parameters = value != null ? (JSON.parse(value) as P) : workflowParameters
    const response: ModuleParametersMessages.Updated<P> = {
      action: 'Updated',
      content: {
        id: moduleId,
        parameters
      }
    }

    this._moduleParametersSignal.emit(response)
    return response
  }

  private async _handleUpdateModuleParameters(updateMessage: ModuleParametersMessages.Update<P>) {
    const { parameters, id: stepId } = updateMessage.content
    this._store.setItem(`${stepId}:${Target.ModuleParameters}`, JSON.stringify(parameters))

    const response: ModuleParametersMessages.Updated<P> = {
      action: 'Updated',
      content: {
        id: stepId,
        parameters
      }
    }

    const moduleId = this._getModuleIdForStep(stepId)

    // fake data processing
    if (this._processData != null) {
      return this._processData(moduleId, parameters)
        .then(dataContainer => {
          const response: ModuleIOMessages.PreviewUpdated = {
            action: 'PreviewUpdated',
            content: { id: stepId, ...dataContainer }
          }
          return this._moduleDataPreviewSignal.emit(response)
        })
        .then(() => response)
    } else return Promise.resolve(response)
  }

  private async _handleGetModuleIOPreview(stepId: string) {
    const moduleId = this._getModuleIdForStep(stepId)

    // fake data processing
    if (this._processData != null) {
      return this._processData(moduleId, this._mostRecentParameters?.content?.parameters).then(
        dataContainer => {
          const response: ModuleIOMessages.PreviewUpdated = {
            action: 'PreviewUpdated',
            content: { id: stepId, ...dataContainer }
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
      if (action === 'Get') {
        const {
          content: { id: moduleId }
        } = (msg as unknown) as ModuleParametersMessages.Get
        return this._handleGetModuleParameters(moduleId).then(coerce)
      } else if (action === 'Update') {
        return this._handleUpdateModuleParameters(
          (msg as unknown) as ModuleParametersMessages.Update<P>
        ).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.ModuleIO) {
      if (action === 'GetPreview') {
        const {
          content: { id }
        } = (msg as unknown) as ModuleIOMessages.GetPreview
        return this._handleGetModuleIOPreview(id).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.Workflow) {
      if (action === 'GetCurrent') {
        const msg: WorkflowMessages.Updated = {
          action: 'Updated',
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

  private _getSignal<T>(target: Target): Signal<MockContext<P>, T> {
    if (target === Target.ModuleParameters) {
      return (this._moduleParametersSignal as unknown) as Signal<MockContext<P>, T>
    } else if (target === Target.ModuleIO) {
      return (this._moduleDataPreviewSignal as unknown) as Signal<MockContext<P>, T>
    } else if (target === Target.Workflow) {
      return (this._workflowSignal as unknown) as Signal<MockContext<P>, T>
    } else if (target === Target.Activity) {
      return (this._activitySignal as unknown) as Signal<MockContext<P>, T>
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

  get moduleViewProvider(): ModuleViewProvider {
    return viewProvider
  }

  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void {
    this._statusChangedSignal.connect((ctx: MockContext<P>, isAvailable: boolean) => callback(isAvailable))
  }
}
