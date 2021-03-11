/**
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
 * Announces progress of current operation to the frontend.
 */
export interface MsgProgress {
  /**
   * Progress in percents.
   */
  progress: number
}

/**
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
 * Run this step with the latest used parameters on all data (not preview only).
 */
export interface MsgModuleIOExecute {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
}

/**
 * Update preview parameters (or preview filters) for the current workflow.
 */
export interface MsgModuleIOPreviewParametersUpdate {
  /**
   * Size of the preview
   */
  size?: number
}

/**
 * Get preview of I/O data of a step from the current workflow.
 */
export interface MsgModuleIOPreviewGet {
  /**
   * Unique ID of the step within the workflow that we are getting preview for.
   */
  id: string
}

/**
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
 * Contains preview of I/O data of a step from the current workflow.
 */
export interface MsgModuleIOPreviewUpdated {
  /**
   * Unique ID of the step within the workflow that the preview is for.
   */
  id: string
  /**
   * Input data for the module
   */
  inputs: unknown[]
  /**
   * Output data for the module
   */
  outputs: unknown[]
}

/**
 * Get list of notes for a workflow step.
 */
export interface MsgNotesGetList {
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Contains list of notes for a workflow step.
 */
export interface MsgNotesList {
  notes: Note[]
  /**
   * Workflow step Id.
   */
  stepId: string
}

/**
 * Get parameters of a step from the current workflow.
 */
export interface MsgParametersGet {
  /**
   * Unique ID of the step within the workflow that we are getting parameters for.
   */
  id: string
}

/**
 * Update parameters of a step in the current workflow.
 */
export interface MsgParametersUpdate {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * Optional parameters of the step that we are setting.
   */
  parameters?: { [key: string]: unknown }
}

/**
 * Updated parameters of a step in the current workflow.
 */
export interface MsgParametersUpdated {
  /**
   * Unique ID of the step within the workflow.
   */
  id: string
  /**
   * Optional parameters of the step.
   */
  parameters?: { [key: string]: unknown }
}

/**
 * Create snapshot of parameters of a step from the current workflow.
 */
export interface MsgParametersSnapshotCreate {
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
 * List of snapshots for a step from the current workflow.
 */
export interface MsgParametersSnapshotList {
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
 * Contains current workflow.
 */
export interface MsgWorkflowUpdated {
  /**
   * Current workflow.
   */
  workflow?: Workflow
}

/**
 * Represents a workflow.
 *
 * Current workflow.
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
   * ID of the module that is used in this step.
   */
  moduleId: string
  /**
   * Optional parameters of the module that are applied in this step.
   */
  parameters?: { [key: string]: unknown }
}
