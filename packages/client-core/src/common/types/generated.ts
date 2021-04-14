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
  filter?: DataRepositoryItemsFilter
}

/**
 * Filter to apply to items
 */
export interface DataRepositoryItemsFilter {
  /**
   * Start from item
   */
  pageOffset?: number
  /**
   * Number of items to return
   */
  pageSize?: number
}

/**
 * Target: "dataRepository"
 * Message type: "GetItemPreview"
 *
 * Item preview
 */
export interface MsgDataRepositoryGetItemPreview {
  /**
   * Item ID
   */
  id: string
}

/**
 * Target: "dataRepository"
 * Message type: "ItemPreview"
 *
 * Item preview
 */
export interface MsgDataRepositoryItemPreview {
  item: DataRepositoryItem
}

/**
 * Item from data repository
 */
export interface DataRepositoryItem {
  /**
   * Unique ID of the item
   */
  id: string
}

/**
 * Target: "dataRepository"
 * Message type: "Items"
 *
 * Items from data repository
 */
export interface MsgDataRepositoryItems {
  filter?: DataRepositoryItemsFilter
  items: DataRepositoryItem[]
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
 * Message type: "GetInputValues"
 *
 * Get values of inputs of a step from the current workflow.
 */
export interface MsgModuleIOGetInputValues {
  /**
   * Input IDs for which the full value should be returned.
   * This is only relevant for big complex types.
   */
  fullValueInputIds?: string[]
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  id: string
  /**
   * Limit returned values only to inputs with these IDs.
   */
  inputIds?: string[]
}

/**
 * Target: "moduleIO"
 * Message type: "GetOutputValues"
 *
 * Get values of outputs of a step from the current workflow.
 */
export interface MsgModuleIOGetOutputValues {
  /**
   * Output IDs for which the full value should be returned.
   * This is only relevant for big complex types.
   */
  fullValueOutputIds?: string[]
  /**
   * Unique ID of the step within the workflow that we are getting values for.
   */
  id: string
  /**
   * Limit returned values only to outputs with these IDs.
   */
  outputIds?: string[]
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
 * Message type: "GetTabularInputValue"
 *
 * Get a filtered version of a tabular input of a step from the current workflow.
 */
export interface MsgModuleIOGetTabularInputValue {
  filter: DataTabularDataFilter
  /**
   * Unique ID of the input
   */
  inputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * An ID associated with this filtered version of the tabular value.
   * This is needed to distinguish between different views of the same data value that may
   * exist independently.
   */
  viewId: string
}

/**
 * Filter for tabular data
 */
export interface DataTabularDataFilter {
  /**
   * Offset of the page
   */
  offset?: number
  /**
   * Size of the page
   */
  pageSize: number
}

/**
 * Target: "moduleIO"
 * Message type: "GetTabularOutputValue"
 *
 * Get a filtered version of a tabular output of a step from the current workflow.
 */
export interface MsgModuleIOGetTabularOutputValue {
  filter: DataTabularDataFilter
  /**
   * Unique ID of the output
   */
  outputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * An ID associated with this filtered version of the tabular value.
   * This is needed to distinguish between different views of the same data value that may
   * exist independently.
   */
  viewId: string
}

/**
 * Target: "moduleIO"
 * Message type: "InputValuesUpdated"
 *
 * Updated input values of a step in the current workflow.
 * TODO: At the moment only those values that are not outputs of other modules (hence the
 * ones used in the UI).
 */
export interface MsgModuleIOInputValuesUpdated {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * Input values.
   */
  inputValues?: { [key: string]: unknown }
}

/**
 * Target: "moduleIO"
 * Message type: "OutputUpdated"
 *
 * Contains output data of a step from the current workflow after it was recalculated.
 */
export interface MsgModuleIOOutputUpdated {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * Output data for the module
   */
  outputs: unknown[]
}

/**
 * Target: "moduleIO"
 * Message type: "OutputValuesUpdated"
 *
 * Updated output values of a step in the current workflow.
 */
export interface MsgModuleIOOutputValuesUpdated {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * Output values. Key - valueId, Value - actual value.
   */
  outputValues?: { [key: string]: unknown }
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
 * Message type: "TabularInputValueUpdated"
 *
 * A filtered version of a tabular input of a step from the current workflow.
 */
export interface MsgModuleIOTabularInputValueUpdated {
  filter: DataTabularDataFilter
  /**
   * Unique ID of the input
   */
  inputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * The actual value payload. TODO: The type will be set later
   */
  value?: { [key: string]: unknown } | string
  /**
   * An ID associated with this filtered version of the tabular value.
   * This is needed to distinguish between different views of the same data value that may
   * exist independently.
   */
  viewId: string
}

/**
 * Target: "moduleIO"
 * Message type: "TabularOutputValueUpdated"
 *
 * A filtered version of a tabular output of a step from the current workflow.
 */
export interface MsgModuleIOTabularOutputValueUpdated {
  filter: DataTabularDataFilter
  /**
   * Unique ID of the output
   */
  outputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * The actual value payload. TODO: The type will be set later
   */
  value?: { [key: string]: unknown } | string
  /**
   * An ID associated with this filtered version of the tabular value.
   * This is needed to distinguish between different views of the same data value that may
   * exist independently.
   */
  viewId: string
}

/**
 * Target: "moduleIO"
 * Message type: "UnregisterTabularInputView"
 *
 * If there is a view of a table with the provided ID, unregister this view and stop sending
 * updates about it to the frontend.
 */
export interface MsgModuleIOUnregisterTabularInputView {
  /**
   * Unique ID of the input
   */
  inputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * An ID associated with this filtered version of the tabular value.
   * This is needed to distinguish between different views of the same data value that may
   * exist independently.
   */
  viewId: string
}

/**
 * Target: "moduleIO"
 * Message type: "UnregisterTabularOutputView"
 *
 * If there is a view of a table with the provided ID, unregister this view and stop sending
 * updates about it to the frontend.
 */
export interface MsgModuleIOUnregisterTabularOutputView {
  /**
   * Unique ID of the output
   */
  outputId: string
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  stepId: string
  /**
   * An ID associated with this filtered version of the tabular value.
   * This is needed to distinguish between different views of the same data value that may
   * exist independently.
   */
  viewId: string
}

/**
 * Target: "moduleIO"
 * Message type: "UpdateInputValues"
 *
 * Update input values of a step in the current workflow.
 * TODO: At the moment only those values that are not outputs of other modules (hence the
 * ones used in the UI).
 */
export interface MsgModuleIOUpdateInputValues {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * Input values.
   */
  inputValues?: { [key: string]: unknown }
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
   * Unique ID of the note.
   */
  id: string
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
   * Current workflow.
   */
  workflow?: Workflow
}

/**
 * Current workflow.
 *
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

/**
 * Container for complex data types.
 * Basic data types are: string, int, float, bool and lists of these types.
 * Everything else requires a container that contains some metadata hinting what the type
 * is.
 * For some types like 'table' the value is not provided because it may be too big.
 * A batch view of the data value should be used to access such values.
 */
export interface DataValueContainer {
  /**
   * Type of the data value.
   */
  dataType: DataType
  /**
   * Some statistical numbers describing data.
   * The content of this field is type dependent.
   * E.g. for 'table' this could contain the actual number of rows.
   */
  stats?: { [key: string]: unknown }
  /**
   * Actual value. This may be provided (e.g. Date) or may not be provided (e.g. Table without
   * a batch view)
   */
  value?: string
}

/**
 * Type of the data value.
 */
export enum DataType {
  Table = 'table'
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
