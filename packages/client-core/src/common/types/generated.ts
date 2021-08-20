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
 * Message type: "GetItemValue"
 *
 * Get value from data repository.
 */
export interface MsgDataRepositoryGetItemValue {
  /**
   * Filter applied to the value
   * TODO: This is tabular filter at the moment but will be changed to an abstract filter
   * which will depend on the data type.
   */
  filter?: DataTabularDataFilter
  /**
   * Unique ID of the item.
   */
  itemId: string
}

/**
 * Filter applied to the value
 * TODO: This is tabular filter at the moment but will be changed to an abstract filter
 * which will depend on the data type.
 *
 * Filter for tabular data
 *
 * Filter applied to the value
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
 * Target: "dataRepository"
 * Message type: "ItemValue"
 *
 * Response to GetItemValue request.
 * Contains value and metadata.
 */
export interface MsgDataRepositoryItemValue {
  /**
   * Filter applied to the value
   */
  filter?: DataTabularDataFilter
  /**
   * Unique ID of the item.
   */
  itemId: string
  /**
   * Metadata of the value if applicable. Simple types usually do not include it.
   * Complex ones like table do.
   */
  metadata?: { [key: string]: unknown }
  /**
   * Type of the value
   */
  type: string
  /**
   * Actual serialized value.
   * It may be a filtered value in case of a complex value.
   * Filter is also returned if the value is filtered.
   */
  value?: unknown
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
 * Message type: "Execute"
 *
 * Execute a Kiara workflow.
 */
export interface MsgWorkflowExecute {
  /**
   * Input values of the workflow.
   */
  inputs?: { [key: string]: unknown }
  /**
   * Name of the module or pipeline workflow to execute.
   */
  moduleName: string
  /**
   * A unique ID representing this request. It's needed solely to correlate this request to
   * the response in pub/sub.
   */
  requestId: string
  /**
   * If true, the outputs of the workflow will be saved in the data repository.
   */
  save?: boolean
  /**
   * ID of the workflow execution
   */
  workflowId?: string
}

/**
 * Target: "workflow"
 * Message type: "ExecutionResult"
 *
 * Result of an execution of a Kiara workflow.
 */
export interface MsgWorkflowExecutionResult {
  /**
   * Error message when status is 'error'.
   */
  errorMessage?: string
  /**
   * A unique ID representing the execution request. Set in `Execute` message.
   */
  requestId: string
  /**
   * Result of the execution. Structure depends on the workflow. TBD.
   */
  result?: { [key: string]: unknown }
  status: MsgWorkflowExecutionResultStatus
}

export enum MsgWorkflowExecutionResultStatus {
  Error = 'error',
  Ok = 'ok'
}

/**
 * Target: "workflow"
 * Message type: "GetWorkflowList"
 *
 * Request a list of workflows available for the user.
 */
export interface MsgWorkflowGetWorkflowList {
  /**
   * If set to true, include workflow body.
   */
  includeWorkflow?: boolean
}

/**
 * Target: "workflow"
 * Message type: "LoadLumyWorkflow"
 *
 * Load a Lumy workflow.
 */
export interface MsgWorkflowLoadLumyWorkflow {
  /**
   * A path to the workflow or the whole workflow structure
   */
  workflow: LumyWorkflow | string
}

/**
 * Lumy workflow configuration.
 * Contains all details needed for Lumy to load, install dependencies, render and run Kiara
 * workflow.
 */
export interface LumyWorkflow {
  /**
   * Workflow metadata
   */
  meta: LumyWorkflowMetadata
  /**
   * Workflow processing configuration details
   */
  processing: ProcessingSection
  /**
   * Workflow rendering definitions
   */
  ui: RenderingSection
}

/**
 * Workflow metadata
 */
export interface LumyWorkflowMetadata {
  /**
   * Human readable name of the workflow.
   */
  label: string
}

/**
 * Workflow processing configuration details
 */
export interface ProcessingSection {
  data?: DataProcessingDetailsSection
  dependencies?: ProcessingDependenciesSection
  workflow: ProcessingWorkflowSection
}

export interface DataProcessingDetailsSection {
  transformations?: DataTransformationDescriptor[]
}

/**
 * Data type transformation method details.
 */
export interface DataTransformationDescriptor {
  /**
   * If set to 'true', this transformation will be used for this particular type by default if
   * more than one transformation is available and no view is provided.
   */
  default?: boolean
  pipeline: DataTransformationItemPipelineDetails
  /**
   * Name of source Kiara data type to apply transformation to.
   */
  sourceType: string
  /**
   * Name of target Kiara data type to apply transformation to.
   */
  targetType: string
  /**
   * Name of the view which serves as an additional hint which transformation to choose if
   * there is more than one available
   */
  view?: string
}

export interface DataTransformationItemPipelineDetails {
  /**
   * Name of the Kiara pipeline to use.
   * The pipeline must have one input: 'source' and one output: 'target'.
   */
  name: string
}

export interface ProcessingDependenciesSection {
  pythonPackages?: PackageDependency[]
}

/**
 * Python package dependency.
 */
export interface PackageDependency {
  /**
   * Package name as a PEP508 string (https://www.python.org/dev/peps/pep-0508/). The standard
   * pip requirement string.
   */
  name: string
}

export interface ProcessingWorkflowSection {
  /**
   * Name of the kiara workflow.
   */
  name: string
}

/**
 * Workflow rendering definitions
 */
export interface RenderingSection {
  dependencies?: UIDependenciesSection
  /**
   * List of pages that comprise the workflow UI part.
   */
  pages?: WorkflowPageDetails[]
}

export interface UIDependenciesSection {
  pythonPackages?: PackageDependency[]
}

/**
 * All details needed to render a page (step) of the workflow.
 */
export interface WorkflowPageDetails {
  /**
   * Details of the component that renders this page
   */
  component: WorkflowPageComponent
  /**
   * ID (slug) of the page. Must be unique within this workflow.
   */
  id: string
  /**
   * Layout metadata
   */
  layout?: WorkflowPageLayoutMetadata
  /**
   * Details of mapping between page inputs/outputs and processing workflow steps
   * inputs/outputs
   */
  mapping?: WorkflowPageMappingDetails
  /**
   * Workflow page metadata
   */
  meta?: LumyWorkflowPageMetadata
}

/**
 * Details of the component that renders this page
 */
export interface WorkflowPageComponent {
  /**
   * ID of the component
   */
  id: string
  /**
   * URL of the package that contains this component.
   * NOTE: This will likely be removed once package dependencies support is implemented.
   */
  url?: string
}

/**
 * Layout metadata
 */
export interface WorkflowPageLayoutMetadata {
  dataPreview?: DataPreviewLayoutMetadataItem[]
}

/**
 * Input or output that has to be rendered in the data preview section for this step context.
 */
export interface DataPreviewLayoutMetadataItem {
  /**
   * ID of the input or output to render
   */
  id: string
  type: InputOrOutput
}

export enum InputOrOutput {
  Input = 'input',
  Output = 'output'
}

/**
 * Details of mapping between page inputs/outputs and processing workflow steps
 * inputs/outputs
 */
export interface WorkflowPageMappingDetails {
  inputs?: WorkflowPageMapping[]
  outputs?: WorkflowPageMapping[]
}

/**
 * Mapping of a single input/output outlet between the processing pipeline and the workflow
 * page.
 */
export interface WorkflowPageMapping {
  /**
   * ID of the input/output on the page
   */
  pageIoId: string
  /**
   * Specifies type the input is expected to be in.
   * A respective data transformation method will be used.
   */
  type?: string
  /**
   * Name of the view transformation to use for the expected type.
   */
  view?: string
  /**
   * ID of the input/output on the processing side
   */
  workflowIoId: string
  /**
   * ID of the step of the pipeline. If not provided, the input output is considered to be one
   * of the pipeline input/outputs.
   */
  workflowStepId?: string
}

/**
 * Workflow page metadata
 */
export interface LumyWorkflowPageMetadata {
  /**
   * Human readable name of the page.
   */
  label?: string
}

/**
 * Target: "workflow"
 * Message type: "LumyWorkflowLoadProgress"
 *
 * Progress status updates published when a Lumy workflow is being loaded.
 * This is mostly needed to publish updates about installed dependencies
 */
export interface MsgWorkflowLumyWorkflowLoadProgress {
  message: string
  /**
   * Status of the process
   */
  status: MsgWorkflowLumyWorkflowLoadProgressStatus
  /**
   * Message type
   */
  type: Type
}

/**
 * Status of the process
 */
export enum MsgWorkflowLumyWorkflowLoadProgressStatus {
  Loaded = 'loaded',
  Loading = 'loading'
}

/**
 * Message type
 */
export enum Type {
  Error = 'error',
  Info = 'info'
}

/**
 * Target: "workflow"
 * Message type: "PageComponentsCode"
 *
 * Javascript code that renders pages of the workflow.
 */
export interface MsgWorkflowPageComponentsCode {
  code: Code[]
}

export interface Code {
  /**
   * Actual JS code
   */
  content: string
  /**
   * Unique ID of this code snippet
   */
  id: string
}

/**
 * Target: "workflow"
 * Message type: "Updated"
 *
 * Workflow currently loaded into the app.
 */
export interface MsgWorkflowUpdated {
  workflow?: LumyWorkflow
}

/**
 * Target: "workflow"
 * Message type: "WorkflowList"
 *
 * A list of workflows available for the user.
 */
export interface MsgWorkflowWorkflowList {
  workflows: WorkflowListItem[]
}

export interface WorkflowListItem {
  body?: LumyWorkflow
  /**
   * Workflow name
   */
  name: string
  /**
   * URI of the workflow (file path or URL).
   */
  uri: string
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
 * NOTE: deprecated, will be removed.
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
 * NOTE: deprecated, will be removed.
 * Workflow structure. Contains all modules that are a part of the workflow.
 */
export interface WorkflowStructure {
  /**
   * Steps of the workflow.
   */
  steps: WorkflowStep[]
}

/**
 * NOTE: deprecated, will be removed.
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
