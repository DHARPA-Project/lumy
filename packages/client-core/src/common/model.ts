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
