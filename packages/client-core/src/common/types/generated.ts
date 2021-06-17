/**
 * Target: "activity"
 * Message type: "Error"
 *
 * Indicates that an error occured and contains error details.
 */
export interface MsgError {
  /**
   * A less user friendly error message. Optional.
   */
  extendedMessage?: string
  /**
   * Unique ID of the error, for traceability.
   */
  id: string
  /**
   * User friendly error message.
   */
  message: string
}

/**
 * Target: "activity"
 * Message type: "ExecutionState"
 *
 * Announces current state of the backend. Useful for letting the user know if they need to
 * wait.
 */
export interface MsgExecutionState {
  /**
   * Current state.
   */
  state: State
}

/**
 * Current state.
 */
export enum State {
  Busy = 'busy',
  Idle = 'idle'
}

/**
 * Target: "activity"
 * Message type: "GetSystemInfo"
 *
 * Get System information
 */
export interface MsgGetSystemInfo {
  fields?: string[]
}

/**
 * Target: "activity"
 * Message type: "Progress"
 *
 * Announces progress of current operation to the frontend.
 */
export interface MsgProgress {
  /**
   * Progress in percents.
   */
  progress: number
}

/**
 * Target: "activity"
 * Message type: "SystemInfo"
 *
 * System information
 */
export interface MsgSystemInfo {
  /**
   * Versions of backend components.
   */
  versions: { [key: string]: unknown }
}

/**
 * Target: "dataRepository"
 * Message type: "CreateSubset"
 *
 * Request to create a subset of items
 */
export interface MsgDataRepositoryCreateSubset {
  /**
   * List of items IDs to add to the subset
   */
  itemsIds: string[]
  /**
   * Label of the subset
   */
  label: string
}

/**
 * Target: "dataRepository"
 * Message type: "FindItems"
 *
 * Request to find items in data repository
 */
export interface MsgDataRepositoryFindItems {
  filter: DataRepositoryItemsFilter
}

/**
 * Filter to apply to items
 */
export interface DataRepositoryItemsFilter {
  /**
   * Start from item
   */
  offset?: number
  /**
   * Number of items to return
   */
  pageSize?: number
  /**
   * Limit the result to these data types.
   */
  types?: string[]
}

/**
 * Target: "dataRepository"
 * Message type: "Items"
 *
 * Items from data repository.
 */
export interface MsgDataRepositoryItems {
  filter: DataRepositoryItemsFilter
  /**
   * Serialized table with items as rows.
   */
  items: unknown
  /**
   * Stats of the data repository.
   */
  stats: { [key: string]: unknown }
}

/**
 * Target: "dataRepository"
 * Message type: "Subset"
 *
 * A subset of items
 */
export interface MsgDataRepositorySubset {
  /**
   * Unique ID of the subset
   */
  id: string
  /**
   * List of items IDs to add to the subset
   */
  itemsIds: string[]
  /**
   * Label of the subset
   */
  label: string
}

/**
 * Target: "moduleIO"
 * Message type: "Execute"
 *
 * Run this step with the latest used parameters on all data (not preview only).
 */
export interface MsgModuleIOExecute {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
}

/**
 * Target: "moduleIO"
 * Message type: "GetInputValue"
 *
 * Get value of a step input from the current workflow.
 * This is a 'pull' request meaning that a synchronous response will be returned. The
 * behaviour of the response is different depending on whether it is a simple or complex
 * value.
 * For simple values the filter is ignored and full value is always returned.
 * For complex values only stats are returned unless 'filter' is set and is not empty.
 */
export interface MsgModuleIOGetInputValue {
  filter?: DataTabularDataFilter
  /**
   * ID of the input
   */
  inputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
}

/**
 * Filter for tabular data
 */
export interface DataTabularDataFilter {
  condition?: DataTabularDataFilterCondition
  /**
   * Whether to ignore other filter items and return full value.
   */
  fullValue?: boolean
  /**
   * Offset of the page
   */
  offset?: number
  /**
   * Size of the page
   */
  pageSize?: number
  sorting?: DataTabularDataSortingMethod
}

export interface DataTabularDataFilterCondition {
  /**
   * Condition items
   */
  items: DataTabularDataFilterItem[]
  /**
   * Operator used to combine items
   */
  operator: Operator
}

/**
 * Filter condition item
 */
export interface DataTabularDataFilterItem {
  /**
   * Id of the column to filter
   */
  column: string
  /**
   * Filter operator
   */
  operator: string
  /**
   * Value for the operator
   */
  value: unknown
}

/**
 * Operator used to combine items
 */
export enum Operator {
  And = 'and',
  Or = 'or'
}

/**
 * Sorting method
 */
export interface DataTabularDataSortingMethod {
  /**
   * Id of the column to filter
   */
  column: string
  /**
   * sorting direction
   */
  direction?: Direction
}

/**
 * sorting direction
 */
export enum Direction {
  Asc = 'asc',
  Default = 'default',
  Desc = 'desc'
}

/**
 * Target: "moduleIO"
 * Message type: "GetOutputValue"
 *
 * Get value of a step output from the current workflow.
 * This is a 'pull' request meaning that a synchronous response will be returned. The
 * behaviour of the response is different depending on whether it is a simple or complex
 * value.
 * For simple values the filter is ignored and full value is always returned.
 * For complex values only stats are returned unless 'filter' is set and is not empty.
 */
export interface MsgModuleIOGetOutputValue {
  filter?: DataTabularDataFilter
  /**
   * ID of the output
   */
  outputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
}

/**
 * Target: "moduleIO"
 * Message type: "GetPreview"
 *
 * Get preview of I/O data of a step from the current workflow.
 */
export interface MsgModuleIOGetPreview {
  /**
   * Unique ID of the step within the workflow that we are getting preview for.
   */
  id: string
}

/**
 * Target: "moduleIO"
 * Message type: "InputValue"
 *
 * Response to GetInputValue 'pull' request.
 * Contains value and stats for an input.
 */
export interface MsgModuleIOInputValue {
  filter?: DataTabularDataFilter
  /**
   * ID of the input
   */
  inputId: string
  /**
   * Stats of the value if applicable. Simple types usually do not include stats.
   * Complex ones like table do.
   */
  stats?: { [key: string]: unknown }
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * Type of the input value
   */
  type: string
  /**
   * Actual serialized value.
   * It may be undefined if not set. It may be a filtered value in case of a complex value.
   * Filter is also returned if the value is filtered.
   */
  value?: unknown
}

/**
 * Target: "moduleIO"
 * Message type: "InputValuesUpdated"
 *
 * Input IDs of a step in the current workflow that had their values updated.
 */
export interface MsgModuleIOInputValuesUpdated {
  /**
   * IDs of inputs that had their values updated.
   */
  inputIds: string[]
  /**
   * Unique ID of the step within the workflow.
   */
  stepId: string
}

/**
 * Target: "moduleIO"
 * Message type: "OutputValue"
 *
 * Response to GetOutputValue 'pull' request.
 * Contains value and stats for an output.
 */
export interface MsgModuleIOOutputValue {
  filter?: DataTabularDataFilter
  /**
   * ID of the output
   */
  outputId: string
  /**
   * Stats of the value if applicable. Simple types usually do not include stats.
   * Complex ones like table do.
   */
  stats?: { [key: string]: unknown }
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * Type of the output value
   */
  type: string
  /**
   * Actual serialized value.
   * It may be undefined if not set. It may be a filtered value in case of a complex value.
   * Filter is also returned if the value is filtered.
   */
  value?: unknown
}

/**
 * Target: "moduleIO"
 * Message type: "OutputValuesUpdated"
 *
 * Output IDs of a step in the current workflow that had their values updated.
 */
export interface MsgModuleIOOutputValuesUpdated {
  /**
   * IDs of outputs that had their values updated.
   */
  outputIds: string[]
  /**
   * Unique ID of the step within the workflow.
   */
  stepId: string
}

/**
 * Target: "moduleIO"
 * Message type: "PreviewUpdated"
 *
 * Contains preview of I/O data of a step from the current workflow.
 */
export interface MsgModuleIOPreviewUpdated {
  /**
   * Unique ID of the step within the workflow that the preview is for.
   */
  id: string
  /**
   * Input data of the module. Key is input Id.
   */
  inputs: { [key: string]: unknown }
  /**
   * Output data of the module. Key is input Id.
   */
  outputs: { [key: string]: unknown }
}

/**
 * Target: "moduleIO"
 * Message type: "UpdateInputValues"
 *
 * Update input values of a step in the current workflow.
 * Only disconnected values can be updated.
 */
export interface MsgModuleIOUpdateInputValues {
  /**
   * Input values.
   */
  inputValues?: { [key: string]: DataValueContainer }
  /**
   * Unique ID of the step within the workflow.
   */
  stepId: string
}

/**
 * Used to send serialized data from front end to back end.
 */
export interface DataValueContainer {
  /**
   * Type of the data value.
   */
  dataType: DataType
  /**
   * Actual serialized value.
   */
  value?: unknown
}

/**
 * Type of the data value.
 */
export enum DataType {
  Simple = 'simple',
  Table = 'table'
}

/**
 * Target: "moduleIO"
 * Message type: "UpdatePreviewParameters"
 *
 * Update preview parameters (or preview filters) for the current workflow.
 */
export interface MsgModuleIOUpdatePreviewParameters {
  /**
   * Size of the preview
   */
  size?: number
}

/**
 * Target: "notes"
 * Message type: "Add"
 *
 * Add a note for a workflow step.
 */
export interface MsgNotesAdd {
  note: Note
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Represents a step note.
 */
export interface Note {
  /**
   * Textual content of the note.
   */
  content: string
  /**
   * When the note was created. Must be an ISO string.
   */
  createdAt: string
  /**
   * Unique ID of the note.
   */
  id: string
  /**
   * Optional title of the note
   */
  title?: string
}

/**
 * Target: "notes"
 * Message type: "Delete"
 *
 * Delete a note by Id.
 */
export interface MsgNotesDelete {
  /**
   * Note Id.
   */
  noteId: string
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Target: "notes"
 * Message type: "GetNotes"
 *
 * Get list of notes for a workflow step.
 */
export interface MsgNotesGetNotes {
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Target: "notes"
 * Message type: "Notes"
 *
 * Contains list of notes for a workflow step.
 */
export interface MsgNotesNotes {
  notes: Note[]
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Target: "notes"
 * Message type: "Update"
 *
 * Update a note for a workflow step.
 */
export interface MsgNotesUpdate {
  note: Note
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Target: "parameters"
 * Message type: "CreateSnapshot"
 *
 * Create snapshot of parameters of a step from the current workflow.
 */
export interface MsgParametersCreateSnapshot {
  /**
   * Optional parameters of the step.
   */
  parameters: { [key: string]: unknown }
  /**
   * Unique ID of the step within the workflow.
   */
  stepId: string
}

/**
 * Target: "parameters"
 * Message type: "Snapshots"
 *
 * List of snapshots for a step from the current workflow.
 */
export interface MsgParametersSnapshots {
  /**
   * List of snapshots.
   */
  snapshots: unknown[]
  /**
   * Unique ID of the step within the workflow.
   */
  stepId: string
}

/**
 * Target: "workflow"
 * Message type: "Updated"
 *
 * Contains current workflow.
 */
export interface MsgWorkflowUpdated {
  /**
   * Current workflow state. Type: PipelineState from
   * https://dharpa.org/kiara/development/entities/modules/PipelineState.json .
   * Not using it as a reference because of a code generation bug.
   */
  workflow?: { [key: string]: unknown }
}

/**
 * Stats object for arrow table
 */
export interface TableStats {
  /**
   * Number of rows.
   */
  rowsCount: number
}

/**
 * Represents a workflow.
 */
export interface Workflow {
  /**
   * Unique ID of the workflow.
   */
  id: string
  /**
   * Human readable name of the workflow.
   */
  label: string
  /**
   * Modular structure of the workflow.
   */
  structure: WorkflowStructure
}

/**
 * Modular structure of the workflow.
 *
 * Workflow structure. Contains all modules that are a part of the workflow.
 */
export interface WorkflowStructure {
  /**
   * Steps of the workflow.
   */
  steps: WorkflowStep[]
}

/**
 * A single Workflow step.
 */
export interface WorkflowStep {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * State of module inputs of the step. Key is stepId.
   */
  inputs: { [key: string]: WorkflowIOState }
  /**
   * ID of the module that is used in this step.
   */
  moduleId: string
  /**
   * State of module outputs of the step. Key is stepId.
   */
  outputs: { [key: string]: WorkflowIOState }
}

/**
 * State of a single input or output.
 */
export interface WorkflowIOState {
  connection?: IOStateConnection
  /**
   * Optional default value
   */
  defaultValue?: unknown[] | boolean | number | number | { [key: string]: unknown } | string
  /**
   * Indicates whether the value is tabular. This field will likely be gone in real backend.
   */
  isTabular?: boolean
}

/**
 * Incoming or outgoing connection of a module
 */
export interface IOStateConnection {
  /**
   * ID of the input or output
   */
  ioId: string
  /**
   * ID of the step
   */
  stepId: string
}
