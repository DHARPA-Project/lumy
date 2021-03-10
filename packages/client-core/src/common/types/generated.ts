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
 * Get preview of I/O data of a step from the current workflow.
 */
export interface MsgModuleIOPreviewGet {
  /**
   * Unique ID of the step within the workflow that we are getting preview for.
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
 * Contains preview of I/O data of a step from the current workflow.
 */
export interface MsgModuleIOPreviewUpdated {
  /**
   * Unique ID of the step within the workflow that the preview is for.
   */
  id: string
  /**
   * Inputs data for the module
   */
  inputs: unknown[]
  /**
   * Inputs data for the module
   */
  outputs: unknown[]
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
