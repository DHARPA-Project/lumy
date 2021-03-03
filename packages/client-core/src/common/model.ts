/**
 * Generic types.
 */

/**
 * Data model types
 */
export enum DataModelTypes {
  TextList = 'TextList'
}

/**
 * Data model base
 */
export interface DataModel {
  type: DataModelTypes
  label?: string
}

/**
 * Data model: list of texts
 */
export interface TextListDataModel extends DataModel {
  type: DataModelTypes.TextList
  texts: string[]
}

/**
 * Input and Output data model
 */
export type InputData = Record<string, DataModel>
export type OutputData = Record<string, DataModel>

export interface WorkflowStructureStep {
  id: string
  module_id: string // TODO: convert to/from camel case in the backend
}

export interface WorkflowStructure {
  steps: WorkflowStructureStep[]
}

export interface Workflow {
  id: string
  label: string
  structure: WorkflowStructure
}
