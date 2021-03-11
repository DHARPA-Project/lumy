import { Signal } from '@lumino/signaling'

import {
  IBackEndContext,
  Target,
  MessageEnvelope,
  Workflow,
  ModuleViewProvider,
  Messages,
  ME
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

export type DataProcessorResult = Omit<Messages.ModuleIO.PreviewUpdated, 'id'>

export type DataProcessor<P = void> = (moduleId: string, moduleParameters: P) => Promise<DataProcessorResult>

export interface MockContextParameters {
  processData: DataProcessor
  currentWorkflow?: Workflow
  startupDelayMs?: number
}

export class MockContext implements IBackEndContext {
  private _isDisposed = false
  private _store: Storage
  private _processData: DataProcessor

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext, boolean>(this)

  private _moduleParametersSignal = new Signal<MockContext, ME<Messages.Parameters.Updated<void>>>(this)
  private _moduleDataPreviewSignal = new Signal<MockContext, ME<Messages.ModuleIO.PreviewUpdated>>(this)
  private _workflowSignal = new Signal<MockContext, ME<Messages.Workflow.Updated>>(this)
  private _activitySignal = new Signal<MockContext, void>(this)

  private _mostRecentParameters: ME<Messages.Parameters.Updated<void>>
  private _currentWorkflow: Workflow

  constructor(parameters?: MockContextParameters) {
    this._store = window.localStorage
    this._processData = parameters?.processData
    this._currentWorkflow = parameters?.currentWorkflow

    this._moduleParametersSignal.connect(this._handleParametersUpdated, this)

    setTimeout(() => {
      this._isReady = true
      this._statusChangedSignal.emit(this._isReady)
    }, parameters?.startupDelayMs ?? 0)
  }

  private _handleParametersUpdated(_: MockContext, parameters: ME<Messages.Parameters.Updated<void>>) {
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
    const workflowParameters = this._currentWorkflow?.structure?.steps?.find(step => step.id === moduleId)
      ?.parameters

    const parameters = value != null ? JSON.parse(value) : workflowParameters
    const response = Messages.Parameters.codec.Updated.encode({
      id: moduleId,
      parameters: (parameters as unknown) as void
    })

    this._moduleParametersSignal.emit(response)
    return response
  }

  private async _handleUpdateModuleParameters(updateMessage: ME<Messages.Parameters.Update<void>>) {
    const { parameters, id: stepId } = updateMessage.content
    this._store.setItem(`${stepId}:${Target.ModuleParameters}`, JSON.stringify(parameters))

    const response = Messages.Parameters.codec.Updated.encode({
      id: stepId,
      parameters
    })

    const moduleId = this._getModuleIdForStep(stepId)

    // fake data processing
    if (this._processData != null) {
      return this._processData(moduleId, parameters)
        .then(dataContainer => {
          const response = Messages.ModuleIO.codec.PreviewUpdated.encode({ id: stepId, ...dataContainer })
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
          const response = Messages.ModuleIO.codec.PreviewUpdated.encode({
            id: stepId,
            ...dataContainer
          })
          return this._moduleDataPreviewSignal.emit(response)
        }
      )
    }
  }

  sendMessage<T, U = void>(target: Target, msg: MessageEnvelope<T>): Promise<U> {
    const { action } = msg
    const coerce = <T>(v: T) => (v as unknown) as U
    const cast = <M>(msg: ME<T>): ME<M> => (msg as unknown) as ME<M>

    if (target === Target.ModuleParameters) {
      if (action === 'Get') {
        const { id: stepId } = Messages.Parameters.codec.Get.decode(cast<Messages.Parameters.Get>(msg))
        return this._handleGetModuleParameters(stepId).then(coerce)
      } else if (action === 'Update') {
        return this._handleUpdateModuleParameters(cast<Messages.Parameters.Update<void>>(msg)).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.ModuleIO) {
      if (action === 'GetPreview') {
        const { id } = (msg.content as unknown) as Messages.ModuleIO.GetPreview
        return this._handleGetModuleIOPreview(id).then(coerce)
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    } else if (target === Target.Workflow) {
      if (action === 'GetCurrent') {
        const msg = Messages.Workflow.codec.Updated.encode({
          workflow: this._currentWorkflow
        })
        this._workflowSignal.emit(msg)
        return
      }

      throw new Error(`Action "${action}" not supported for target "${target}"`)
    }

    throw new Error(`Target not supported: ${target}`)
  }

  private _getSignal<T>(target: Target): Signal<MockContext, T> {
    if (target === Target.ModuleParameters) {
      return (this._moduleParametersSignal as unknown) as Signal<MockContext, T>
    } else if (target === Target.ModuleIO) {
      return (this._moduleDataPreviewSignal as unknown) as Signal<MockContext, T>
    } else if (target === Target.Workflow) {
      return (this._workflowSignal as unknown) as Signal<MockContext, T>
    } else if (target === Target.Activity) {
      return (this._activitySignal as unknown) as Signal<MockContext, T>
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
    this._statusChangedSignal.connect((ctx: MockContext, isAvailable: boolean) => callback(isAvailable))
  }
}
