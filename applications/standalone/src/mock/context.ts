import { Signal } from '@lumino/signaling'
import { Field, List, ListVector, Table, Utf8, Utf8Vector } from 'apache-arrow'

import {
  IBackEndContext,
  Target,
  MessageEnvelope,
  ModuleViewProvider,
  Messages,
  ME,
  IDecode,
  DataProcessor,
  mockDataProcessorFactory,
  State,
  serialize,
  deserializeDataValue,
  DataProcessorResult,
  TabularDataFilter,
  PipelineState,
  workflowUtils,
  DataType,
  deserialize,
  TableStats,
  DataRepositoryItemsTable,
  DataRepositoryItemsStats,
  arrowUtils,
  Note
} from '@dharpa-vre/client-core'
import { viewProvider } from '@dharpa-vre/modules'

function getRandomId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return uint32.toString(16)
}

const adapter = <T>(decoder: IDecode<T>, handler: (msg: T) => Promise<ME<unknown> | undefined | void>) => {
  return (msg: ME<unknown>): Promise<ME<unknown> | undefined | void> => {
    const content = decoder(msg as ME<T>)
    if (content !== undefined) return handler(content)
    return undefined
  }
}

const getValueType = (value: unknown): string => {
  if (value instanceof Table) return DataType.Table
  return DataType.Simple
}

const getValueStats = <S = unknown>(value: unknown): S => {
  if (value instanceof Table) {
    const table = value
    const tableStats: TableStats = {
      rowsCount: table.length
    }
    return (tableStats as unknown) as S
  }
  return undefined as S
}

const getFilteredValue = <T = unknown>(value: T, filter?: TabularDataFilter): T => {
  if (value instanceof Table) {
    const table = value
    if (filter?.fullValue) return table
    if (filter == null) return undefined

    const offset = filter?.offset ?? 0
    const pageSize = filter?.pageSize ?? 5
    const filteredTable = table.slice(offset, offset + pageSize)
    return (filteredTable as unknown) as T
  }
  return value
}

const newMockDataRepositoryTable = (numItems = 30): DataRepositoryItemsTable => {
  const rowNumbers = [...Array(numItems).keys()]
  const isTableType = rowNumbers.map(() => Math.random() >= 0.5)

  return Table.new({
    id: Utf8Vector.from(rowNumbers.map(n => `id-${n}`)),
    alias: Utf8Vector.from(rowNumbers.map(n => `Item #${n}`)),
    type: Utf8Vector.from(isTableType.map(isTable => (isTable ? 'table' : 'string'))),
    columnNames: ListVector.from({
      values: isTableType.map((isTable, idx) => (isTable ? [`a${idx}`, `b${idx}`, `c${idx}`] : null)),
      type: new List(Field.new({ name: 0, type: new Utf8() })),
      highWaterMark: 1 // NOTE: working around a stride serialisation bug in arrowjs
    }),
    columnTypes: ListVector.from({
      values: isTableType.map(isTable => (isTable ? ['int', 'string', 'float'] : null)),
      type: new List(Field.new({ name: 0, type: new Utf8() })),
      highWaterMark: 1 // NOTE: working around a stride serialisation bug in arrowjs
    })
  }) as DataRepositoryItemsTable
}

const getMockDataRepositoryTable = (): DataRepositoryItemsTable => {
  const storeKey = '__dharpa_mock_data_repository'
  const serializedTable = window.localStorage.getItem(storeKey)
  if (serializedTable == null) {
    const table = newMockDataRepositoryTable()
    window.localStorage.setItem(storeKey, serialize(table) as string)
  }
  return deserialize<DataRepositoryItemsTable, unknown>(
    window.localStorage.getItem(storeKey),
    undefined,
    DataType.Table
  )[0]
}

interface IOValueStoreValue {
  type: string
  value: unknown
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

  private serializeValue(value: unknown): IOValueStoreValue {
    if (value instanceof Table) return { type: DataType.Table, value: serialize(value) }
    return { type: 'unknown', value: serialize(value) }
  }

  private deserializeValue(value: IOValueStoreValue): unknown {
    if (value?.type == null) return undefined
    return deserialize(value.value, undefined, value.type)[0]
  }

  private getSerializedFromStore(): Record<string, IOValueStoreValue> {
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
    if (defaultValue == null) return undefined
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

interface NotesStoreWorkflow {
  steps: { [stepId: string]: Note[] }
}
interface NotesStoreWorkflows {
  [workflowId: string]: NotesStoreWorkflow
}

class NotesStore {
  private _store: Storage
  private _storeKey: string

  private _workflows: NotesStoreWorkflows

  constructor(storeKey = '__dharpa_workflows_notes') {
    this._store = window.localStorage
    this._storeKey = storeKey
  }

  private restore() {
    try {
      this._workflows = JSON.parse(this._store.getItem(this._storeKey))
    } catch (e) {
    } finally {
      if (this._workflows == null) this._workflows = {}
    }
  }

  private persist() {
    this._store.setItem(this._storeKey, JSON.stringify(this._workflows))
  }

  get workflows() {
    if (this._workflows == null) this.restore()
    return this._workflows
  }

  getNotes(workflowId: string, stepId: string) {
    const workflow: NotesStoreWorkflow = this.workflows[workflowId] ?? { steps: {} }
    const stepNotes = workflow.steps[stepId] ?? []
    return stepNotes
  }

  addOrUpdateNote(workflowId: string, stepId: string, note: Note) {
    const workflow: NotesStoreWorkflow = this.workflows[workflowId] ?? { steps: {} }
    const stepNotes = workflow.steps[stepId] ?? []
    const noteIdx = stepNotes.findIndex(n => n.id === note.id)
    if (noteIdx >= 0) {
      stepNotes[noteIdx] = note
    } else {
      stepNotes.push({ ...note, id: getRandomId() })
    }

    workflow.steps[stepId] = stepNotes
    this.workflows[workflowId] = workflow
    this.persist()
  }

  deleteNote(workflowId: string, stepId: string, noteId: string) {
    const workflow: NotesStoreWorkflow = this.workflows[workflowId] ?? { steps: {} }
    const stepNotes = workflow.steps[stepId] ?? []
    const noteIdx = stepNotes.findIndex(n => n.id === noteId)
    if (noteIdx >= 0) {
      const updatedNotes = [...stepNotes]
      updatedNotes.splice(noteIdx, 1)
      workflow.steps[stepId] = updatedNotes
      this.workflows[workflowId] = workflow
      this.persist()
    }
  }
}

export interface MockContextParameters {
  processData?: DataProcessor
  currentWorkflow: PipelineState
  startupDelayMs?: number
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

  private _mockDataRepository: DataRepositoryItemsTable
  private _mockNotesStore: NotesStore

  constructor(parameters: MockContextParameters) {
    this._mockDataRepository = getMockDataRepositoryTable()
    this._processData =
      parameters?.processData ?? mockDataProcessorFactory(viewProvider, this._mockDataRepository)
    this._currentWorkflow = parameters?.currentWorkflow

    this._store = new IOValuesStore(this._currentWorkflow)
    this._mockNotesStore = new NotesStore()

    this._signals = {
      [Target.Activity]: new Signal<MockContext, ME<unknown>>(this),
      [Target.Workflow]: new Signal<MockContext, ME<unknown>>(this),
      [Target.ModuleIO]: new Signal<MockContext, ME<unknown>>(this),
      [Target.DataRepository]: new Signal<MockContext, ME<unknown>>(this),
      [Target.Notes]: new Signal<MockContext, ME<unknown>>(this)
    }

    this._signals[Target.Workflow].connect(this._handleWorkflow, this)
    this._signals[Target.ModuleIO].connect(this._handleModuleIO, this)
    this._signals[Target.DataRepository].connect(this._handleDataRepository, this)
    this._signals[Target.Notes].connect(this._handleNotes, this)

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async _handleActivity(_: MockContext, _msg: ME<unknown>): Promise<ME<unknown> | undefined | void> {
    return Promise.resolve()
  }

  private async _handleWorkflow(_: MockContext, msg: ME<unknown>): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.Workflow.codec.GetCurrent.action:
        return adapter(Messages.Workflow.codec.GetCurrent.decode, async () => {
          const msg = Messages.Workflow.codec.Updated.encode({
            workflow: (this._currentWorkflow.structure as unknown) as { [key: string]: unknown }
          })
          this._signals[Target.Workflow].emit(msg)
        })(msg)
      default:
        break
    }
  }

  private async _handleModuleIO(_: MockContext, msg: ME<unknown>): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.ModuleIO.codec.GetPreview.action:
        return adapter(Messages.ModuleIO.codec.GetPreview.decode, async ({ id }) => {
          await this._processStepData(id)
        })(msg)
      case Messages.ModuleIO.codec.GetInputValue.action:
        return adapter(Messages.ModuleIO.codec.GetInputValue.decode, async ({ stepId, inputId, filter }) => {
          const storeValue = this._store.getInputValue(stepId, inputId)

          return Messages.ModuleIO.codec.InputValue.encode({
            stepId,
            inputId,
            filter,
            value: serialize(getFilteredValue(storeValue, filter)),
            stats: getValueStats(storeValue),
            type: getValueType(storeValue)
          })
        })(msg)
      case Messages.ModuleIO.codec.GetOutputValue.action:
        return adapter(
          Messages.ModuleIO.codec.GetOutputValue.decode,
          async ({ stepId, outputId, filter }) => {
            const storeValue = this._store.getOutputValue(stepId, outputId)

            return Messages.ModuleIO.codec.OutputValue.encode({
              stepId,
              outputId,
              filter,
              value: serialize(getFilteredValue(storeValue, filter)),
              stats: getValueStats(storeValue),
              type: getValueType(storeValue)
            })
          }
        )(msg)
      case Messages.ModuleIO.codec.UpdateInputValues.action:
        return adapter(Messages.ModuleIO.codec.UpdateInputValues.decode, async ({ stepId, inputValues }) => {
          Object.entries(inputValues).forEach(([inputId, value]) =>
            this._store.setInputValue(stepId, inputId, deserializeDataValue(value))
          )
          this.updateInputValuesForStep(stepId, Object.keys(inputValues))

          await this._processStepData(stepId)
        })(msg)
      default:
        break
    }
  }

  private async _handleDataRepository(
    _: MockContext,
    msg: ME<unknown>
  ): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.DataRepository.codec.FindItems.action:
        return adapter(Messages.DataRepository.codec.FindItems.decode, async ({ filter }) => {
          const repositoryTable = this._mockDataRepository

          const filteredTable =
            filter.types == null
              ? repositoryTable
              : arrowUtils.filterTable(repositoryTable, row => filter.types?.includes(row.type))

          const offset = filter.offset ?? 0
          const pageSize = filter.pageSize ?? 5
          const page = filteredTable.slice(offset, offset + pageSize)

          const serializedTable = serialize(page)
          const stats: DataRepositoryItemsStats = {
            rowsCount: filteredTable.count()
          }

          const message = Messages.DataRepository.codec.Items.encode({
            filter,
            items: serializedTable,
            stats: (stats as unknown) as { [key: string]: unknown }
          })
          this._signals[Target.DataRepository].emit(message)
        })(msg)
      default:
        break
    }
  }

  private async _handleNotes(_: MockContext, msg: ME<unknown>): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.Notes.codec.GetNotes.action:
        return adapter(Messages.Notes.codec.GetNotes.decode, async ({ stepId }) => {
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.structure.pipelineId, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      case Messages.Notes.codec.Add.action:
        return adapter(Messages.Notes.codec.Add.decode, async ({ stepId, note }) => {
          this._mockNotesStore.addOrUpdateNote(this._currentWorkflow.structure.pipelineId, stepId, note)
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.structure.pipelineId, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      case Messages.Notes.codec.Update.action:
        return adapter(Messages.Notes.codec.Update.decode, async ({ stepId, note }) => {
          this._mockNotesStore.addOrUpdateNote(this._currentWorkflow.structure.pipelineId, stepId, note)
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.structure.pipelineId, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      case Messages.Notes.codec.Delete.action:
        return adapter(Messages.Notes.codec.Delete.decode, async ({ stepId, noteId }) => {
          this._mockNotesStore.deleteNote(this._currentWorkflow.structure.pipelineId, stepId, noteId)
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.structure.pipelineId, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      default:
        break
    }
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
    const allInputIds = Object.keys(this._store.getInputValues(stepId))

    const response = Messages.ModuleIO.codec.InputValuesUpdated.encode({
      stepId,
      inputIds: allInputIds.filter(([k]) => (inputIdsOnly.length > 0 ? inputIdsOnly.includes(k) : true))
    })

    this._signals[Target.ModuleIO].emit(response)
  }

  private updateOutputValuesForStep(stepId: string, outputIdsOnly: string[] = []) {
    const allOutputIds = Object.keys(this._store.getOutputValues(stepId))

    const msg: Messages.ModuleIO.OutputValuesUpdated = {
      stepId,
      outputIds: allOutputIds.filter(([k]) => (outputIdsOnly.length > 0 ? outputIdsOnly.includes(k) : true))
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

  async sendMessage<T, U = void>(target: Target, msg: MessageEnvelope<T>): Promise<U> {
    const response = await (async () => {
      switch (target) {
        case Target.Activity:
          return this._handleActivity(undefined, msg).then(x => (x as unknown) as U)
        case Target.ModuleIO:
          return this._handleModuleIO(undefined, msg).then(x => (x as unknown) as U)
        case Target.Workflow:
          return this._handleWorkflow(undefined, msg).then(x => (x as unknown) as U)
        case Target.DataRepository:
          return this._handleDataRepository(undefined, msg).then(x => (x as unknown) as U)
        case Target.Notes:
          return this._handleNotes(undefined, msg).then(x => (x as unknown) as U)
      }
    })()
    if (response != null) this._signals[target].emit((response as unknown) as ME<unknown>)
    return
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
