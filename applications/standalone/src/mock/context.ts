import { Signal } from '@lumino/signaling'
import { Table } from 'apache-arrow'

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
  mockDataProcessorFactory,
  State,
  serializeFilteredTable,
  serialize,
  deserializeValue,
  DataValueType,
  WorkflowStructure,
  DataProcessorResult,
  TabularDataFilter
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

const adapter = <T>(decoder: IDecode<T>, handler: (msg: T) => void) => {
  return (msg: ME<unknown>) => handlerAdapter(decoder, handler)(undefined, msg as ME<T>)
}

class IOValuesStore {
  private _store: Storage
  private _workflowStructure: WorkflowStructure
  private _storeKey: string
  private _values: Record<string, unknown>
  private _outputValues: Record<string, unknown>

  private _keySeparator = '♨️'

  constructor(workflowStructure: WorkflowStructure, storeKey = '__dharpa_mock_input_values') {
    this._store = window.localStorage
    this._workflowStructure = workflowStructure
    this._storeKey = storeKey

    this.loadFromStore()
    this._outputValues = {}
  }

  private serializeValue(value: unknown): unknown {
    if (value instanceof Table) return serializeFilteredTable(value, value)
    return serialize(value)
  }

  private deserializeValue(value: DataValueType): unknown {
    return deserializeValue(value)[1]
  }

  private getSerializedFromStore(): Record<string, DataValueType> {
    this._values = {}
    const storeDataString: string | undefined = this._store.getItem(this._storeKey)
    try {
      return storeDataString == null ? {} : JSON.parse(storeDataString)
    } catch (e) {
      console.warn(
        `Could not load mock data values from localStorage (key ${this._storeKey}) because of ${e}. Starting from scratch.`
      )
      return {}
    }
  }

  private loadFromStore() {
    const values = this.getSerializedFromStore()
    this._values = Object.entries(values).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: this.deserializeValue(v) }),
      {} as Record<string, unknown>
    )
  }

  private saveToStore() {
    const values = Object.entries(this._values).reduce(
      (acc, [k, v]) => ({ ...acc, [k]: this.serializeValue(v) }),
      {} as Record<string, unknown>
    )
    this._store.setItem(this._storeKey, JSON.stringify(values))
  }

  private asKey(stepId: string, inputId: string): string {
    return [stepId, this._keySeparator, inputId].join('')
  }

  private getCorrespondingInput(stepId: string, outputId: string): [string, string] {
    const stepWithOutput = this._workflowStructure.steps.find(step => step.id === stepId)
    if (stepWithOutput == null) return [undefined, undefined]

    const descriptor = stepWithOutput.outputs[outputId]
    return [descriptor?.connection?.stepId, descriptor?.connection?.ioId]
  }

  private getDefaultValue<T = unknown>(stepId: string, inputId: string): T | undefined {
    const step = this._workflowStructure.steps.find(step => step.id === stepId)

    const descriptor = step.inputs[inputId]
    return (descriptor?.defaultValue as unknown) as T
  }

  private getValue<T = unknown>(stepId: string, ioId: string, isInput: boolean): T | undefined {
    const [actualStepId, inputId] = isInput ? [stepId, ioId] : this.getCorrespondingInput(stepId, ioId)
    if ((actualStepId == null || inputId == null) && !isInput)
      return this._outputValues[this.asKey(stepId, ioId)] as T

    const value = this._values[this.asKey(actualStepId, inputId)] as T
    return value ?? this.getDefaultValue(actualStepId, inputId)
  }

  getInputValue<T = unknown>(stepId: string, inputId: string): T | undefined {
    return this.getValue(stepId, inputId, true)
  }

  getOutputValue<T = unknown>(stepId: string, inputId: string): T | undefined {
    return this.getValue(stepId, inputId, false)
  }

  getInputValues(stepId: string, inputIds?: string[]): { [inputId: string]: unknown } {
    const step = this._workflowStructure.steps.find(step => step.id === stepId)
    const allInputIds = Object.keys(step?.inputs ?? {})
    const actualInputIds = inputIds ?? allInputIds
    return actualInputIds.reduce((acc, inputId) => {
      const value = this.getInputValue(stepId, inputId)
      return value == null ? acc : { ...acc, [inputId]: value }
    }, {} as { [inputId: string]: unknown })
  }

  private setValue<T = unknown>(stepId: string, ioId: string, value: T, isInput: boolean) {
    const [actualStepId, inputId] = isInput ? [stepId, ioId] : this.getCorrespondingInput(stepId, ioId)
    if ((actualStepId == null || inputId == null) && !isInput) {
      this._outputValues[this.asKey(stepId, ioId)] = value
    } else {
      this._values[this.asKey(actualStepId, inputId)] = value
      this.saveToStore()
    }
  }

  setInputValue<T = unknown>(stepId: string, inputId: string, value: T) {
    return this.setValue(stepId, inputId, value, true)
  }

  setOutputValue<T = unknown>(stepId: string, outputId: string, value: T) {
    return this.setValue(stepId, outputId, value, false)
  }
}

export interface MockContextParameters {
  processData?: DataProcessor
  currentWorkflow: Workflow
  startupDelayMs?: number
}

interface ViewFilters {
  [stepId: string]: {
    [ioId: string]: {
      [viewId: string]: TabularDataFilter
    }
  }
}

export class MockContext implements IBackEndContext {
  private _isDisposed = false
  private _store: IOValuesStore
  private _processData: DataProcessor

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext, boolean>(this)

  private _currentWorkflow: Workflow

  private _signals: Record<Target, Signal<MockContext, ME<unknown>>>
  private _callbacks = new WeakMap()

  private _currentInputViewFilters: ViewFilters = {}

  constructor(parameters: MockContextParameters) {
    this._processData = parameters?.processData ?? mockDataProcessorFactory(viewProvider)
    this._currentWorkflow = parameters?.currentWorkflow

    this._store = new IOValuesStore(this._currentWorkflow.structure)

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
      /*
        Process all workflow steps on startup just to populate
        inputs and outputs with values.

        NOTE: Doing it the ugly way with a timeout because the
        mock processing functions for each module of the workflow
        are registered only after module's UI component is
        lazily loaded by React. It does not happen immediately
        but it's OK because it's just a mock code.
      */
      setTimeout(() => this._processAllWorkflow(), 1000)
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
      this._processStepData(id)
    })(msg)

    adapter(Messages.ModuleIO.codec.GetInputValues.decode, ({ id: stepId, inputIds }) => {
      const inputValues = this._store.getInputValues(stepId, inputIds)
      const response = Messages.ModuleIO.codec.InputValuesUpdated.encode({
        id: stepId,
        inputValues
      })

      this._signals[Target.ModuleIO].emit(response)
    })(msg)

    adapter(Messages.ModuleIO.codec.UpdateInputValues.decode, async ({ id: stepId, inputValues }) => {
      Object.entries(inputValues).forEach(([inputId, value]) =>
        this._store.setInputValue(stepId, inputId, value)
      )
      await this._processStepData(stepId)
      const udpatedMessage = Messages.ModuleIO.codec.InputValuesUpdated.encode({
        id: stepId,
        inputValues
      })
      this._signals[Target.ModuleIO].emit(udpatedMessage)
    })(msg)

    adapter(Messages.ModuleIO.codec.GetTabularInputValue.decode, ({ viewId, stepId, inputId, filter }) => {
      const { pageSize, offset = 0 } = filter

      const table = this._store.getInputValue<Table>(stepId, inputId)
      if (table == null) return

      const filteredTable = table.slice(offset, offset + pageSize)

      const updatedMessage = Messages.ModuleIO.codec.TabularInputValueUpdated.encode({
        viewId,
        stepId,
        inputId,
        filter,
        value: (serializeFilteredTable(filteredTable, table) as unknown) as Record<string, unknown>
      })
      this._signals[Target.ModuleIO].emit(updatedMessage)

      this.setInputViewFilter(stepId, inputId, viewId, filter)
    })(msg)

    adapter(Messages.ModuleIO.codec.UnregisterTabularInputView.decode, ({ viewId, stepId, inputId }) => {
      this.removeInputViewFilter(stepId, inputId, viewId)
    })(msg)
  }

  private async _processStepData(stepId: string): Promise<void> {
    if (this._processData == null) return

    try {
      this._signals[Target.Activity].emit(
        Messages.Activity.codec.ExecutionState.encode({ state: State.Busy })
      )

      const moduleId = this._getModuleIdForStep(stepId)
      const data = await new Promise<DataProcessorResult>((res, rej) => {
        setTimeout(() =>
          this._processData(stepId, moduleId, this._store.getInputValues(stepId)).then(res).catch(rej)
        )
      })

      Object.entries(data?.outputs ?? {}).forEach(([outputId, value]) => {
        if (value != null) this._store.setOutputValue(stepId, outputId, value)
      })

      const response = Messages.ModuleIO.codec.PreviewUpdated.encode({ id: stepId, ...data })
      this._signals[Target.ModuleIO].emit(response)

      this._updatedInputValuesForAllSteps()
    } finally {
      this._signals[Target.Activity].emit(
        Messages.Activity.codec.ExecutionState.encode({ state: State.Idle })
      )
    }
  }

  private async _processAllWorkflow(): Promise<void> {
    for (const step of this._currentWorkflow.structure.steps) {
      await this._processStepData(step.id)
    }
  }

  _updatedInputValuesForAllSteps(): void {
    this._currentWorkflow?.structure?.steps?.forEach(step => {
      const response = Messages.ModuleIO.codec.InputValuesUpdated.encode({
        id: step.id,
        inputValues: Object.entries(this._store.getInputValues(step.id)).reduce(
          (acc, [k, v]) => ({ ...acc, [k]: serialize(v) }),
          {} as Record<string, unknown>
        )
      })

      this._signals[Target.ModuleIO].emit(response)

      // tabular inputs
      Object.entries(this._store.getInputValues(step.id)).forEach(([inputId, value]) => {
        Object.entries(this.getInputViewFilters(step.id, inputId)).forEach(([viewId, filter]) => {
          if (value == null) return
          const table = value as Table

          const filteredTable = table.slice(filter.offset ?? 0, filter.offset ?? 0 + filter.pageSize)

          const updatedMessage = Messages.ModuleIO.codec.TabularInputValueUpdated.encode({
            viewId,
            stepId: step.id,
            inputId,
            filter,
            value: (serializeFilteredTable(filteredTable, table) as unknown) as Record<string, unknown>
          })
          this._signals[Target.ModuleIO].emit(updatedMessage)
        })
      })
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

  private getInputViewFilters(stepId: string, inputId: string): { [viewId: string]: TabularDataFilter } {
    return this._currentInputViewFilters?.[stepId]?.[inputId] ?? {}
  }

  private setInputViewFilter(
    stepId: string,
    inputId: string,
    viewId: string,
    filter: TabularDataFilter
  ): void {
    const l1 = this._currentInputViewFilters[stepId] ?? {}
    const l2 = l1[inputId] ?? {}
    l2[viewId] = filter

    l1[inputId] = l2
    this._currentInputViewFilters[stepId] = l1
  }

  private removeInputViewFilter(stepId: string, inputId: string, viewId: string): void {
    const l1 = this._currentInputViewFilters[stepId] ?? {}
    const l2 = l1[inputId] ?? {}
    delete l2[viewId]

    l1[inputId] = l2
    this._currentInputViewFilters[stepId] = l1
  }
}
