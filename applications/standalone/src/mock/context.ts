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
  IDecode,
  DataProcessor,
  mockDataProcessorFactory
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

const adapter = <T>(decoder: IDecode<T>, handler: (msg: T) => void) => {
  return (msg: ME<unknown>) => handlerAdapter(decoder, handler)(undefined, msg as ME<T>)
}

const getInputValuesStoreKey = (stepId: string): string =>
  `__dharpa_vre_mock:${stepId}:${Target.ModuleIO}:inputValues`

export interface MockContextParameters {
  processData?: DataProcessor
  currentWorkflow?: Workflow
  startupDelayMs?: number
}

export class MockContext implements IBackEndContext {
  private _isDisposed = false
  private _store: Storage
  private _processData: DataProcessor
  private _computedOutputValues: { [stepOutputId: string]: unknown } = {}

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext, boolean>(this)

  private _currentWorkflow: Workflow

  private _signals: Record<Target, Signal<MockContext, ME<unknown>>>
  private _callbacks = new WeakMap()

  constructor(parameters?: MockContextParameters) {
    this._store = window.localStorage
    this._processData = parameters?.processData ?? mockDataProcessorFactory(viewProvider)
    this._currentWorkflow = parameters?.currentWorkflow

    this._signals = {
      [Target.Activity]: new Signal<MockContext, ME<unknown>>(this),
      [Target.Workflow]: new Signal<MockContext, ME<unknown>>(this),
      [Target.ModuleIO]: new Signal<MockContext, ME<unknown>>(this)
    }

    this._signals[Target.Workflow].connect(this._handleWorkflow, this)
    this._signals[Target.ModuleIO].connect(this._handleModuleIO, this)

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

    adapter(Messages.ModuleIO.codec.GetInputValues.decode, ({ id }) => {
      const inputValues = this._getStepInputValues(id)
      const response = Messages.ModuleIO.codec.InputValuesUpdated.encode({
        id,
        inputValues
      })

      this._signals[Target.ModuleIO].emit(response)
    })(msg)

    adapter(Messages.ModuleIO.codec.UpdateInputValues.decode, async ({ id, inputValues }) => {
      this._setStepInputValues(id, inputValues)
      await this._processPreviewData(id)
      const udpatedMessage = Messages.ModuleIO.codec.InputValuesUpdated.encode({
        id,
        inputValues
      })
      this._signals[Target.ModuleIO].emit(udpatedMessage)
    })(msg)

    adapter(Messages.ModuleIO.codec.GetTabularInputValue.decode, ({ id, inputId, filter }) => {
      const updatedMessage = Messages.ModuleIO.codec.TabularInputValueUpdated.encode({
        id,
        inputId,
        filter,
        value: { x: new Date() }
      })
      this._signals[Target.ModuleIO].emit(updatedMessage)
    })(msg)
  }

  private _getStepInputValues(stepId: string): { [inputId: string]: unknown } {
    const value = this._store.getItem(getInputValuesStoreKey(stepId))
    const step = this._currentWorkflow?.structure?.steps?.find(step => step.id === stepId)
    const defaultValues = Object.entries(step?.inputs ?? {}).reduce(
      (acc, [inputId, value]) => ({ ...acc, [inputId]: value.defaultValue }),
      {}
    )

    const inputValues = value != null ? JSON.parse(value) : defaultValues

    Object.entries(step.inputs).forEach(([inputId, state]) => {
      if (state.connection == null) return
      const stepOutputId = `${state.connection.stepId}:${state.connection.ioId}`
      const value = this._computedOutputValues[stepOutputId]
      if (value != null) inputValues[inputId] = value
    })

    return inputValues
  }

  private _setStepInputValues(stepId: string, values: { [key: string]: unknown }) {
    this._store.setItem(getInputValuesStoreKey(stepId), JSON.stringify(values))
  }

  private async _processPreviewData(stepId: string): Promise<void> {
    if (this._processData == null) return

    const moduleId = this._getModuleIdForStep(stepId)
    const data = await this._processData(stepId, moduleId, this._getStepInputValues(stepId))

    Object.entries(data?.outputs ?? {}).forEach(([id, value]) => {
      const stepOutputId = `${stepId}:${id}`
      this._computedOutputValues[stepOutputId] = value
    })

    const response = Messages.ModuleIO.codec.PreviewUpdated.encode({ id: stepId, ...data })
    this._signals[Target.ModuleIO].emit(response)

    this._updatedInputValuesForAllSteps()
  }

  _updatedInputValuesForAllSteps(): void {
    this._currentWorkflow?.structure?.steps?.forEach(step => {
      const response = Messages.ModuleIO.codec.InputValuesUpdated.encode({
        id: step.id,
        inputValues: this._getStepInputValues(step.id)
      })

      this._signals[Target.ModuleIO].emit(response)
    })
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

  addFilesToRepository(files: File[]): Promise<void> {
    return Promise.resolve((files as unknown) as void)
  }
}
