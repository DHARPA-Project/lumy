import { Signal } from '@lumino/signaling'

import {
  IBackEndContext,
  Target,
  MessageEnvelope,
  Workflow,
  ModuleViewProvider,
  Messages,
  ME,
  handlerAdapter,
  IDecode
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

const adapter = <T>(decoder: IDecode<T>, handler: (msg: T) => void) => {
  return (msg: ME<unknown>) => handlerAdapter(decoder, handler)(undefined, msg as ME<T>)
}

export type DataProcessorResult = Omit<Messages.ModuleIO.PreviewUpdated, 'id'>

export type DataProcessor<P = unknown> = (
  stepId: string,
  moduleId: string,
  moduleParameters: P
) => Promise<DataProcessorResult>

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

  private _currentWorkflow: Workflow

  private _signals: Record<Target, Signal<MockContext, ME<unknown>>>
  private _callbacks = new WeakMap()

  constructor(parameters?: MockContextParameters) {
    this._store = window.localStorage
    this._processData = parameters?.processData
    this._currentWorkflow = parameters?.currentWorkflow

    this._signals = {
      [Target.Activity]: new Signal<MockContext, ME<unknown>>(this),
      [Target.Workflow]: new Signal<MockContext, ME<unknown>>(this),
      [Target.ModuleParameters]: new Signal<MockContext, ME<unknown>>(this),
      [Target.ModuleIO]: new Signal<MockContext, ME<unknown>>(this)
    }

    this._signals[Target.Workflow].connect(this._handleWorkflow, this)
    this._signals[Target.ModuleIO].connect(this._handleModuleIO, this)
    this._signals[Target.ModuleParameters].connect(this._handleModuleParameters, this)

    setTimeout(() => {
      this._isReady = true
      this._statusChangedSignal.emit(this._isReady)
    }, parameters?.startupDelayMs ?? 0)
  }

  get isDisposed(): boolean {
    return this._isDisposed
  }

  dispose(): void {
    this._isDisposed = true
  }

  private _getModuleIdForStep(stepId: string): string {
    const step = this._currentWorkflow.structure.steps.find(step => step.id === stepId)
    return step?.moduleId
  }

  private _handleWorkflow(_: MockContext, msg: ME<unknown>) {
    adapter(Messages.Workflow.codec.GetCurrent.decode, () => {
      const msg = Messages.Workflow.codec.Updated.encode({
        workflow: this._currentWorkflow
      })
      this._signals[Target.Workflow].emit(msg)
    })(msg)
  }

  private _handleModuleIO(_: MockContext, msg: ME<unknown>) {
    adapter(Messages.ModuleIO.codec.GetPreview.decode, ({ id }) => {
      this._processPreviewData(id)
      // return this._handleGetModuleIOPreview(id)
    })(msg)
  }

  private _handleModuleParameters(_: MockContext, msg: ME<unknown>) {
    adapter(Messages.Parameters.codec.Get.decode, ({ id }) => {
      const parameters = this._getStepParameters(id)
      const response = Messages.Parameters.codec.Updated.encode({
        id,
        parameters
      })

      this._signals[Target.ModuleParameters].emit(response)
    })(msg)

    adapter(Messages.Parameters.codec.Update.decode, async ({ id, parameters }) => {
      this._setStepParameters(id, parameters)
      await this._processPreviewData(id)
      const udpatedMessage = Messages.Parameters.codec.Updated.encode({
        id,
        parameters
      })
      this._signals[Target.ModuleParameters].emit(udpatedMessage)
    })(msg)
  }

  private _getStepParameters(stepId: string) {
    const value = this._store.getItem(`${stepId}:${Target.ModuleParameters}`)
    const workflowParameters = this._currentWorkflow?.structure?.steps?.find(step => step.id === stepId)
      ?.parameters

    return value != null ? JSON.parse(value) : workflowParameters
  }

  private _setStepParameters(stepId: string, parameters: unknown) {
    this._store.setItem(`${stepId}:${Target.ModuleParameters}`, JSON.stringify(parameters))
  }

  private async _processPreviewData(stepId: string): Promise<void> {
    const moduleId = this._getModuleIdForStep(stepId)
    if (this._processData == null) return

    const data = await this._processData(stepId, moduleId, this._getStepParameters(stepId))
    const response = Messages.ModuleIO.codec.PreviewUpdated.encode({ id: stepId, ...data })
    return this._signals[Target.ModuleIO].emit(response)
  }

  sendMessage<T, U = void>(target: Target, msg: MessageEnvelope<T>): Promise<U> {
    this._signals[target].emit(msg)
    return Promise.resolve(undefined)
  }

  subscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void {
    const cb = (_: MockContext, msg: ME<unknown>) => callback(undefined, msg as ME<T>)
    this._callbacks.set(callback, cb)
    this._signals[target].connect(cb)
  }

  unsubscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void {
    if (this._callbacks.has(callback)) this._signals[target].disconnect(this._callbacks.get(callback))
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
