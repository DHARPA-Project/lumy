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
  DataType,
  deserialize,
  TableStats,
  DataRepositoryItemsTable,
  DataRepositoryItemsStats,
  arrowUtils,
  Note,
  DataSortingMethod,
  DataFilterCondition,
  WorkflowExecutionStatus,
  LumyWorkflow,
  DynamicModuleViewProvider,
  ModuleProps,
  WorkflowLoadProgressMessageType,
  LumyWorkflowLoadStatus
} from '@dharpa-vre/client-core'

const MockWorkflowUri = 'https://example.com/networkAnalysis.yml'

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

const sortTable = (table: Table, sortingMethod?: DataSortingMethod): Table => {
  const sortingColumn = sortingMethod?.column
  const sortingDirection = sortingMethod?.direction

  if (sortingColumn == null) return table
  return arrowUtils.sortTable(table, (rowA, rowB) => {
    if (sortingDirection == null || sortingDirection == 'default') return 0

    if (rowA[sortingColumn] < rowB[sortingColumn]) return sortingDirection == 'asc' ? -1 : 1
    if (rowA[sortingColumn] > rowB[sortingColumn]) return sortingDirection == 'asc' ? 1 : -1
    return 0
  })
}

const filterTable = (table: Table, condition?: DataFilterCondition): Table => {
  // NOTE: in mock implementation only doing 'contains' filtering
  let filteredTable = table
  for (const item of condition?.items ?? []) {
    if (item.operator !== 'contains') continue
    if (item.value == null || item.value == '') continue

    filteredTable = arrowUtils.filterTable(filteredTable, row => {
      return String(row[item.column]).toLowerCase().includes(String(item.value).toLowerCase())
    })
  }
  return filteredTable
}

const getFilteredValue = <T = unknown, S = { [key: string]: unknown }>(
  value: T,
  filter?: TabularDataFilter
): [T, S] => {
  if (value instanceof Table) {
    const table = value
    if (filter?.fullValue) return [table, getValueStats(table)]
    if (filter == null) return [undefined, getValueStats(table)]

    const filteredTable = filterTable(table, filter.condition)
    const sortedTable = sortTable(filteredTable, filter.sorting)

    const stats = getValueStats(sortedTable)

    const offset = filter?.offset ?? 0
    const pageSize = filter?.pageSize
    const tablePage = pageSize ? sortedTable.slice(offset, offset + pageSize) : sortedTable.slice(offset)

    return [(tablePage as unknown) as T, (stats as unknown) as S]
  }
  return [value, undefined]
}

const newMockDataRepositoryTable = (numItems = 50): DataRepositoryItemsTable => {
  const rowNumbers = [...Array(numItems).keys()]
  const isTableType = rowNumbers.map(() => Math.random() >= 0.5)

  return Table.new({
    id: Utf8Vector.from(rowNumbers.map(n => `id-${n}`)),
    label: Utf8Vector.from(rowNumbers.map(n => `Item #${n}`)),
    type: Utf8Vector.from(isTableType.map(isTable => (isTable ? 'table' : 'string'))),
    columnNames: ListVector.from({
      values: isTableType.map((isTable, index) =>
        isTable ? Array.from({ length: 15 }, (_, i) => `${String.fromCharCode(97 + i)}${index}`) : null
      ),
      type: new List(Field.new({ name: 0, type: new Utf8() })),
      highWaterMark: 1 // NOTE: working around a stride serialisation bug in arrowjs
    }),
    columnTypes: ListVector.from({
      values: isTableType.map(isTable =>
        isTable ? ['int', 'string', 'float', 'string', 'string', 'string'] : null
      ),
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

interface PageIOValues<T> {
  [ioId: string]: T
}

interface MockPageValueDetails<T> {
  inputs?: PageIOValues<T>
  outputs?: PageIOValues<T>
}

interface MockValueStore<T> {
  [pageId: string]: MockPageValueDetails<T>
}

class IOValuesStore {
  private _store: Storage
  private _storeKey: string
  private _values: MockValueStore<unknown>

  constructor(workflowStructure: LumyWorkflow, storeKey = '__dharpa_mock_values') {
    this._store = window.localStorage
    this._storeKey = storeKey

    this.loadFromStore()
  }

  private serializeValue(value: unknown): IOValueStoreValue {
    if (value instanceof Table) return { type: DataType.Table, value: serialize(value) }
    return { type: 'unknown', value: serialize(value) }
  }

  private deserializeValue(value: IOValueStoreValue): unknown {
    if (value?.type == null) return undefined
    return deserialize(value.value, undefined, value.type)[0]
  }

  private getSerializedFromStore(): MockValueStore<IOValueStoreValue> {
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
      (acc, [pageId, { inputs = {}, outputs = {} }]) => ({
        ...acc,
        [pageId]: {
          inputs: Object.entries(inputs).reduce(
            (acc, [inputId, value]) => ({
              ...acc,
              [inputId]: this.deserializeValue(value)
            }),
            {}
          ),
          outputs: Object.entries(outputs).reduce(
            (acc, [outputId, value]) => ({
              ...acc,
              [outputId]: this.deserializeValue(value)
            }),
            {}
          )
        }
      }),
      {} as MockValueStore<unknown>
    )
  }

  private saveToStore() {
    const values = Object.entries(this._values).reduce(
      (acc, [pageId, { inputs = {}, outputs = {} }]) => ({
        ...acc,
        [pageId]: {
          inputs: Object.entries(inputs).reduce(
            (acc, [inputId, value]) => ({
              ...acc,
              [inputId]: this.serializeValue(value)
            }),
            {}
          ),
          outputs: Object.entries(outputs).reduce(
            (acc, [outputId, value]) => ({
              ...acc,
              [outputId]: this.serializeValue(value)
            }),
            {}
          )
        }
      }),
      {} as MockValueStore<IOValueStoreValue>
    )
    this._store.setItem(this._storeKey, JSON.stringify(values))
  }

  private getValue<T = unknown>(pageId: string, ioId: string, isInput: boolean): T | undefined {
    const pageDetails = this._values[pageId]
    const values = isInput ? pageDetails?.inputs : pageDetails?.outputs
    return values?.[ioId] as T
  }

  getInputValue<T = unknown>(stepId: string, inputId: string): T | undefined {
    return this.getValue(stepId, inputId, true)
  }

  getOutputValue<T = unknown>(stepId: string, inputId: string): T | undefined {
    return this.getValue(stepId, inputId, false)
  }

  getInputValues(pageId: string, inputIds?: string[]): { [inputId: string]: unknown } {
    const availableInputIds = Object.keys(this._values[pageId]?.inputs ?? {})

    const actualInputIds = inputIds ?? availableInputIds
    return actualInputIds.reduce((acc, inputId) => {
      const value = this.getInputValue(pageId, inputId)
      return value == null ? acc : { ...acc, [inputId]: value }
    }, {} as { [inputId: string]: unknown })
  }

  getOutputValues(pageId: string, outputIds?: string[]): { [outputId: string]: unknown } {
    const availableOutputIds = Object.keys(this._values[pageId]?.outputs ?? {})
    const actualOutputIds = outputIds ?? availableOutputIds

    return actualOutputIds.reduce((acc, outputId) => {
      const value = this.getOutputValue(pageId, outputId)
      return value == null ? acc : { ...acc, [outputId]: value }
    }, {} as { [outputId: string]: unknown })
  }

  private setValue<T = unknown>(pageId: string, ioId: string, value: T, isInput: boolean) {
    const pageDetails = this._values[pageId] ?? {}
    const values = (isInput ? pageDetails?.inputs : pageDetails?.outputs) ?? {}
    values[ioId] = value

    if (isInput) {
      pageDetails.inputs = values
    } else {
      pageDetails.outputs = values
    }

    this._values[pageId] = pageDetails
    this.saveToStore()
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

export interface SandboxContextParameters {
  currentWorkflow: LumyWorkflow
  defaultModuleComponent: React.FC<ModuleProps>
  processData?: DataProcessor
  startupDelayMs?: number
  moduleProvider?: ModuleViewProvider
}

export class SandboxContext implements IBackEndContext {
  private _isDisposed = false
  private _store: IOValuesStore
  private _processData: DataProcessor

  private _isReady = false
  private _statusChangedSignal = new Signal<SandboxContext, boolean>(this)

  private _currentWorkflow: LumyWorkflow

  private _signals: Record<Target, Signal<SandboxContext, ME<unknown>>>
  private _callbacks = new WeakMap()

  private _mockDataRepository: DataRepositoryItemsTable
  private _mockNotesStore: NotesStore

  private _firstExecutionFlag: Record<string, boolean> = {}

  private _moduleViewProvider: ModuleViewProvider

  constructor(parameters: SandboxContextParameters) {
    this._moduleViewProvider =
      parameters.moduleProvider != null
        ? parameters.moduleProvider
        : new DynamicModuleViewProvider(parameters.defaultModuleComponent)

    this._mockDataRepository = getMockDataRepositoryTable()
    this._processData =
      parameters?.processData ?? mockDataProcessorFactory(this._moduleViewProvider, this._mockDataRepository)
    this._currentWorkflow = parameters?.currentWorkflow

    this._store = new IOValuesStore(this._currentWorkflow)
    this._mockNotesStore = new NotesStore()

    this._signals = {
      [Target.Activity]: new Signal<SandboxContext, ME<unknown>>(this),
      [Target.Workflow]: new Signal<SandboxContext, ME<unknown>>(this),
      [Target.ModuleIO]: new Signal<SandboxContext, ME<unknown>>(this),
      [Target.DataRepository]: new Signal<SandboxContext, ME<unknown>>(this),
      [Target.Notes]: new Signal<SandboxContext, ME<unknown>>(this)
    }

    this._signals[Target.Workflow].connect(this._handleWorkflow, this)
    this._signals[Target.ModuleIO].connect(this._handleModuleIO, this)
    this._signals[Target.DataRepository].connect(this._handleDataRepository, this)
    this._signals[Target.Notes].connect(this._handleNotes, this)
    this._signals[Target.Activity].connect(this._handleActivity, this)

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

  private async _handleActivity(
    _: SandboxContext,
    msg: ME<unknown>
  ): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.Activity.codec.GetSystemInfo.action:
        return adapter(Messages.Activity.codec.GetSystemInfo.decode, async () => {
          const msg = Messages.Activity.codec.SystemInfo.encode({
            versions: {
              middleware: 'in-browser-mock',
              backend: 'in-browser-mock'
            }
          })
          this._signals[Target.Activity].emit(msg)
        })(msg)
      default:
        break
    }
  }

  private async _handleWorkflow(
    _: SandboxContext,
    msg: ME<unknown>
  ): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.Workflow.codec.GetCurrent.action:
        return adapter(Messages.Workflow.codec.GetCurrent.decode, async () => {
          const msg = Messages.Workflow.codec.Updated.encode({
            workflow: this._currentWorkflow,
            metadata: {
              uri: MockWorkflowUri
            }
          })
          this._signals[Target.Workflow].emit(msg)
        })(msg)
      case Messages.Workflow.codec.Execute.action:
        return adapter(Messages.Workflow.codec.Execute.decode, async message => {
          await new Promise(res => setTimeout(res, 1000))
          if (message.moduleName === 'table.from_csv') {
            return Messages.Workflow.codec.ExecutionResult.encode({
              requestId: message.requestId,
              status: WorkflowExecutionStatus.Ok,
              result: {
                test: '123'
              }
            })
          }
          return Messages.Workflow.codec.ExecutionResult.encode({
            requestId: message.requestId,
            status: WorkflowExecutionStatus.Error,
            result: {
              test: '123'
            },
            errorMessage: 'With mock middleware only "table.from_csv" returns a successful response'
          })
        })(msg)
      case Messages.Workflow.codec.GetWorkflowList.action:
        return adapter(Messages.Workflow.codec.GetWorkflowList.decode, async () => {
          return Messages.Workflow.codec.WorkflowList.encode({
            workflows: [
              {
                name: 'Network Analysis',
                uri: MockWorkflowUri,
                body: this._currentWorkflow
              },
              {
                name: 'Network Analysis Clone',
                uri: MockWorkflowUri.concat('-1'),
                body: this._currentWorkflow
              }
            ]
          })
        })(msg)
      case Messages.Workflow.codec.LoadLumyWorkflow.action:
        return adapter(Messages.Workflow.codec.LoadLumyWorkflow.decode, async message => {
          if (typeof message.workflow === 'string')
            throw new Error('Cannot load workflow from a url in a sandbox context')

          for (const i in [...Array(10).keys()]) {
            await new Promise(res => setTimeout(res, 100))
            this._signals[Target.Workflow].emit(
              Messages.Workflow.codec.LumyWorkflowLoadProgress.encode({
                message: [...Array(10).keys()].map(() => `Loading ${i}...`).join(' '),
                type:
                  Math.random() > 0.5
                    ? WorkflowLoadProgressMessageType.Info
                    : WorkflowLoadProgressMessageType.Error,
                status: LumyWorkflowLoadStatus.Loading
              })
            )
          }

          this._currentWorkflow = message.workflow
          return Messages.Workflow.codec.LumyWorkflowLoadProgress.encode({
            message: 'Done',
            type: WorkflowLoadProgressMessageType.Info,
            status: LumyWorkflowLoadStatus.Loaded
          })
        })(msg)
      default:
        break
    }
  }

  private async _tryExecutePageProcessor(pageId: string) {
    if (!this._firstExecutionFlag[pageId]) {
      await this._processStepData(pageId)
      this._firstExecutionFlag[pageId] = true
    }
  }

  private async _handleModuleIO(
    _: SandboxContext,
    msg: ME<unknown>
  ): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.ModuleIO.codec.GetPreview.action:
        return adapter(Messages.ModuleIO.codec.GetPreview.decode, async ({ id }) => {
          await this._processStepData(id)
        })(msg)
      case Messages.ModuleIO.codec.GetInputValue.action:
        return adapter(Messages.ModuleIO.codec.GetInputValue.decode, async ({ stepId, inputId, filter }) => {
          await this._tryExecutePageProcessor(stepId)
          const storeValue = this._store.getInputValue(stepId, inputId)

          const [value, stats] = getFilteredValue(storeValue, filter)

          return Messages.ModuleIO.codec.InputValue.encode({
            stepId,
            inputId,
            filter,
            value: serialize(value),
            stats,
            type: getValueType(storeValue)
          })
        })(msg)
      case Messages.ModuleIO.codec.GetOutputValue.action:
        return adapter(
          Messages.ModuleIO.codec.GetOutputValue.decode,
          async ({ stepId, outputId, filter }) => {
            await this._tryExecutePageProcessor(stepId)

            const storeValue = this._store.getOutputValue(stepId, outputId)

            const [value, stats] = getFilteredValue(storeValue, filter)

            return Messages.ModuleIO.codec.OutputValue.encode({
              stepId,
              outputId,
              filter,
              value: serialize(value),
              stats,
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
    _: SandboxContext,
    msg: ME<unknown>
  ): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.DataRepository.codec.FindItems.action:
        return adapter(Messages.DataRepository.codec.FindItems.decode, async ({ filter }) => {
          const repositoryTable = this._mockDataRepository

          const filteredTable =
            filter?.types == null
              ? repositoryTable
              : arrowUtils.filterTable(repositoryTable, row => filter.types?.includes(row.type))

          const offset = filter?.offset ?? 0
          const pageSize = filter?.pageSize
          const page = pageSize ? filteredTable.slice(offset, offset + pageSize) : filteredTable.slice(offset)

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
      case Messages.DataRepository.codec.GetItemValue.action:
        return adapter(Messages.DataRepository.codec.GetItemValue.decode, async ({ itemId, filter }) => {
          const repositoryTable = this._mockDataRepository
          const row = [...repositoryTable].find(({ id }) => id === itemId)
          if (row == null) return // no such item

          if (row.type === 'table') {
            const rowNumbers = [...Array(20).keys()]
            const tableStructure = [...row.columnNames].reduce((acc, colName) => {
              return {
                ...acc,
                [colName]: Utf8Vector.from(
                  rowNumbers.map(
                    n => `${colName}-lorem-ipsum : ${n}-dolor-sit-amet-consectetur-adipisicing-elit`
                  )
                )
              }
            }, {})
            const tableValue = Table.new(tableStructure)
            const [value, meta] = getFilteredValue(tableValue, filter)

            const message = Messages.DataRepository.codec.ItemValue.encode({
              itemId,
              type: 'table',
              filter,
              metadata: meta,
              value: serialize(value)
            })
            this._signals[Target.DataRepository].emit(message)
          } else {
            const message = Messages.DataRepository.codec.ItemValue.encode({
              itemId,
              type: row.type,
              filter,
              value: 'test'
            })
            this._signals[Target.DataRepository].emit(message)
          }
        })(msg)
      default:
        break
    }
  }

  private async _handleNotes(_: SandboxContext, msg: ME<unknown>): Promise<ME<unknown> | undefined | void> {
    switch (msg.action) {
      case Messages.Notes.codec.GetNotes.action:
        return adapter(Messages.Notes.codec.GetNotes.decode, async ({ stepId }) => {
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.meta.label, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      case Messages.Notes.codec.Add.action:
        return adapter(Messages.Notes.codec.Add.decode, async ({ stepId, note }) => {
          this._mockNotesStore.addOrUpdateNote(this._currentWorkflow.meta.label, stepId, note)
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.meta.label, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      case Messages.Notes.codec.Update.action:
        return adapter(Messages.Notes.codec.Update.decode, async ({ stepId, note }) => {
          this._mockNotesStore.addOrUpdateNote(this._currentWorkflow.meta.label, stepId, note)
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.meta.label, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      case Messages.Notes.codec.Delete.action:
        return adapter(Messages.Notes.codec.Delete.decode, async ({ stepId, noteId }) => {
          this._mockNotesStore.deleteNote(this._currentWorkflow.meta.label, stepId, noteId)
          const notes = this._mockNotesStore.getNotes(this._currentWorkflow.meta.label, stepId)
          return Messages.Notes.codec.Notes.encode({
            stepId,
            notes
          })
        })(msg)
      default:
        break
    }
  }

  private async _processStepData(pageId: string): Promise<void> {
    if (this._processData == null) return

    try {
      this._signals[Target.Activity].emit(
        Messages.Activity.codec.ExecutionState.encode({ state: State.Busy })
      )

      const pageDetails = this._currentWorkflow.ui.pages.find(page => page.id === pageId)
      const data = await new Promise<DataProcessorResult>((res, rej) => {
        setTimeout(() =>
          this._processData(pageDetails, this._store.getInputValues(pageId)).then(res).catch(rej)
        )
      })

      Object.entries(data?.inputs ?? {}).forEach(([inputId, value]) => {
        if (value != null) this._store.setInputValue(pageId, inputId, value)
      })

      Object.entries(data?.outputs ?? {}).forEach(([outputId, value]) => {
        if (value != null) this._store.setOutputValue(pageId, outputId, value)
      })

      const response = Messages.ModuleIO.codec.PreviewUpdated.encode({
        id: pageId,
        inputs: data.inputs ?? {},
        outputs: data.outputs ?? {}
      })
      this._signals[Target.ModuleIO].emit(response)

      this.updateOutputValuesForStep(pageId, Object.keys(data?.outputs ?? {}))
    } finally {
      this._signals[Target.Activity].emit(
        Messages.Activity.codec.ExecutionState.encode({ state: State.Idle })
      )
    }
  }

  private async _processAllWorkflow(): Promise<void> {
    for (const pageId in this._currentWorkflow.ui.pages) {
      await this._processStepData(pageId)
    }
  }

  private updateInputValuesForStep(pageId: string, inputIdsOnly: string[] = []) {
    const pageDetails = this._currentWorkflow.ui.pages.find(page => page.id === pageId)
    const allInputIds = Object.keys(pageDetails.mapping?.inputs ?? {})

    const inputIds = inputIdsOnly.length > 0 ? inputIdsOnly : allInputIds

    if (inputIds.length === 0) return

    const response = Messages.ModuleIO.codec.InputValuesUpdated.encode({
      stepId: pageId,
      inputIds
    })

    this._signals[Target.ModuleIO].emit(response)
  }

  private updateOutputValuesForStep(pageId: string, outputIdsOnly: string[] = []) {
    const pageDetails = this._currentWorkflow.ui.pages.find(page => page.id === pageId)
    const allOutputIds = Object.keys(pageDetails?.mapping?.outputs ?? {})

    const outputIds = outputIdsOnly.length > 0 ? outputIdsOnly : allOutputIds

    if (outputIds.length === 0) return

    const msg: Messages.ModuleIO.OutputValuesUpdated = {
      stepId: pageId,
      outputIds
    }
    const response = Messages.ModuleIO.codec.OutputValuesUpdated.encode(msg)

    this._signals[Target.ModuleIO].emit(response)
  }

  async sendMessage<T, U = void>(target: Target, msg: MessageEnvelope<T>): Promise<U> {
    try {
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
    } catch (e) {
      this._signals[Target.Activity].emit(
        Messages.Activity.codec.Error.encode({
          id: getRandomId(),
          message: (e as Error).message,
          extendedMessage: (e as Error).stack
        })
      )
      throw e
    }
    return
  }

  subscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void {
    const cb = (_: SandboxContext, msg: ME<unknown>) => callback(undefined, msg as ME<T>)
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
    return this._moduleViewProvider
  }

  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void {
    this._statusChangedSignal.connect((_: SandboxContext, isAvailable: boolean) => callback(isAvailable))
  }

  addFilesToRepository(files: File[]): Promise<void> {
    return Promise.resolve((files as unknown) as void)
  }
}
