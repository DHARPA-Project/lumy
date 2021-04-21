import { Signal } from '@lumino/signaling'
import { Table } from 'apache-arrow'

import {
  IBackEndContext,
  Target,
  MessageEnvelope,
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
  DataProcessorResult,
  TabularDataFilter,
  PipelineState,
  workflowUtils
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

const adapter = <T>(decoder: IDecode<T>, handler: (msg: T) => void) => {
  return (msg: ME<unknown>) => handlerAdapter(decoder, handler)(undefined, msg as ME<T>)
}

class IOValuesStore {
  private _store: Storage
  private _workflowStructure: PipelineState
  private _storeKey: string
  private _values: Record<string, unknown>
  private _outputValues: Record<string, unknown>

  private _keySeparator = '♨️'

  constructor(workflowStructure: PipelineState, storeKey = '__dharpa_mock_input_values') {
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
    const connections = workflowUtils.getConnectedInputs(this._workflowStructure, stepId, outputId)

    if (connections.length === 0) return [undefined, undefined]
    // NOTE: even though more than one input can be connected to an output,
    // for the mock context we just pick the first one.
    return connections[0]
  }

  private getDefaultValue<T = unknown>(stepId: string, inputId: string): T | undefined {
    const stepInput = this._workflowStructure.stepInputs[stepId]

    const defaultValue = stepInput?.values?.[inputId]?.valueSchema?.default
    return (defaultValue as unknown) as T
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
    const stepDesc = this._workflowStructure.structure.steps[stepId]
    const allInputIds = Object.keys(stepDesc?.inputConnections ?? {})
    const actualInputIds = inputIds ?? allInputIds
    return actualInputIds.reduce((acc, inputId) => {
      const value = this.getInputValue(stepId, inputId)
      return value == null ? acc : { ...acc, [inputId]: value }
    }, {} as { [inputId: string]: unknown })
  }

  getOutputValues(stepId: string, outputIds?: string[]): { [outputId: string]: unknown } {
    const stepDesc = this._workflowStructure.structure.steps[stepId]
    const allOutputIds = Object.keys(stepDesc?.outputConnections ?? {})
    const actualOutputIds = outputIds ?? allOutputIds

    return actualOutputIds.reduce((acc, outputId) => {
      const value = this.getOutputValue(stepId, outputId)
      return value == null ? acc : { ...acc, [outputId]: value }
    }, {} as { [outputId: string]: unknown })
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
  currentWorkflow: PipelineState
  startupDelayMs?: number
}

interface ViewFilters {
  [stepId: string]: {
    [ioId: string]: {
      [viewId: string]: TabularDataFilter
    }
  }
}

interface FullValueRequiredFlags {
  [stepId: string]: {
    [ioId: string]: boolean
  }
}

export class MockContext implements IBackEndContext {
  private _isDisposed = false
  private _store: IOValuesStore
  private _processData: DataProcessor

  private _isReady = false
  private _statusChangedSignal = new Signal<MockContext, boolean>(this)

  private _currentWorkflow: PipelineState

  private _signals: Record<Target, Signal<MockContext, ME<unknown>>>
  private _callbacks = new WeakMap()

  private _currentInputViewFilters: ViewFilters = {}
  private _fullValueRequiredFlags: FullValueRequiredFlags = {}

  constructor(parameters: MockContextParameters) {
    this._processData = parameters?.processData ?? mockDataProcessorFactory(viewProvider)
    this._currentWorkflow = parameters?.currentWorkflow

    this._store = new IOValuesStore(this._currentWorkflow)

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
    const stepDesc = this._currentWorkflow.structure.steps[stepId]
    return stepDesc?.step?.moduleType
  }

  private _handleWorkflow(_: MockContext, msg: ME<unknown>) {
    adapter(Messages.Workflow.codec.GetCurrent.decode, () => {
      const msg = Messages.Workflow.codec.Updated.encode({
        workflow: (this._currentWorkflow.structure as unknown) as { [key: string]: unknown }
      })
      this._signals[Target.Workflow].emit(msg)
    })(msg)
  }

  private _handleModuleIO(_: MockContext, msg: ME<unknown>) {
    adapter(Messages.ModuleIO.codec.GetPreview.decode, ({ id }) => {
      this._processStepData(id)
    })(msg)

    adapter(
      Messages.ModuleIO.codec.GetInputValues.decode,
      ({ id: stepId, inputIds, fullValueInputIds = [] }) => {
        fullValueInputIds.forEach(inputId => this.setFullValueRequired(stepId, inputId, true))
        this.updateInputValuesForStep(stepId, inputIds)
      }
    )(msg)

    adapter(
      Messages.ModuleIO.codec.GetOutputValues.decode,
      ({ id: stepId, outputIds, fullValueOutputIds = [] }) => {
        fullValueOutputIds.forEach(outputId => this.setFullValueRequired(stepId, outputId, true))
        this.updateOutputValuesForStep(stepId, outputIds)
      }
    )(msg)

    adapter(Messages.ModuleIO.codec.UpdateInputValues.decode, async ({ id: stepId, inputValues }) => {
      Object.entries(inputValues).forEach(([inputId, value]) =>
        this._store.setInputValue(stepId, inputId, deserializeValue(value)[1])
      )
      await this._processStepData(stepId)
      this.updateInputValuesForStep(stepId)
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

      this.updateInputValuesForAllSteps()
      this.updateOutputValuesForAllSteps()
    } finally {
      this._signals[Target.Activity].emit(
        Messages.Activity.codec.ExecutionState.encode({ state: State.Idle })
      )
    }
  }

  private async _processAllWorkflow(): Promise<void> {
    for (const stepId in this._currentWorkflow.structure.steps) {
      await this._processStepData(stepId)
    }
  }

  private updateInputValuesForStep(stepId: string, inputIdsOnly: string[] = []) {
    const serializeValue = (inputId: string, value: unknown) => {
      if (value instanceof Table) {
        if (this.getFullValueRequired(stepId, inputId)) {
          return serializeFilteredTable(value, value)
        }
      }
      return serialize(value)
    }

    const msg = {
      id: stepId,
      inputValues: Object.entries(this._store.getInputValues(stepId))
        .filter(([k]) => (inputIdsOnly.length > 0 ? inputIdsOnly.includes(k) : true))
        .reduce((acc, [k, v]) => ({ ...acc, [k]: serializeValue(k, v) }), {} as Record<string, unknown>)
    }
    const response = Messages.ModuleIO.codec.InputValuesUpdated.encode(msg)

    this._signals[Target.ModuleIO].emit(response)

    // tabular inputs
    Object.entries(this._store.getInputValues(stepId)).forEach(([inputId, value]) => {
      Object.entries(this.getInputViewFilters(stepId, inputId)).forEach(([viewId, filter]) => {
        if (value == null) return
        const table = value as Table
        const filteredTable = table.slice(filter.offset ?? 0, filter.offset ?? 0 + filter.pageSize)

        const updatedMessage = Messages.ModuleIO.codec.TabularInputValueUpdated.encode({
          viewId,
          stepId,
          inputId,
          filter,
          value: (serializeFilteredTable(filteredTable, table) as unknown) as Record<string, unknown>
        })
        this._signals[Target.ModuleIO].emit(updatedMessage)
      })
    })
  }

  private updateOutputValuesForStep(stepId: string, outputIdsOnly: string[] = []) {
    const serializeValue = (outputId: string, value: unknown) => {
      if (value instanceof Table) {
        if (this.getFullValueRequired(stepId, outputId)) {
          return serializeFilteredTable(value, value)
        }
      }
      return serialize(value)
    }

    const msg: Messages.ModuleIO.OutputValuesUpdated = {
      id: stepId,
      outputValues: Object.entries(this._store.getOutputValues(stepId))
        .filter(([k]) => (outputIdsOnly.length > 0 ? outputIdsOnly.includes(k) : true))
        .reduce((acc, [k, v]) => ({ ...acc, [k]: serializeValue(k, v) }), {} as Record<string, unknown>)
    }
    const response = Messages.ModuleIO.codec.OutputValuesUpdated.encode(msg)

    this._signals[Target.ModuleIO].emit(response)
  }

  private updateInputValuesForAllSteps(): void {
    Object.keys(this._currentWorkflow.structure.steps).forEach(stepId =>
      this.updateInputValuesForStep(stepId)
    )
  }
  private updateOutputValuesForAllSteps(): void {
    Object.keys(this._currentWorkflow.structure.steps).forEach(stepId =>
      this.updateOutputValuesForStep(stepId)
    )
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

  private getFullValueRequired(stepId: string, inputId: string): boolean {
    return this._fullValueRequiredFlags?.[stepId]?.[inputId] ?? false
  }

  private setFullValueRequired(stepId: string, inputId: string, isRequired: boolean) {
    const l1 = this._fullValueRequiredFlags?.[stepId] ?? {}
    l1[inputId] = isRequired
    this._fullValueRequiredFlags[stepId] = l1
  }
}
