export interface IoSchema {
  type: string
  default: string
  optional: boolean
  doc: string
}

export interface IoMetadata {
  name: string
  schema: IoSchema
}

export interface PipelineUiSchema {
  inputs: IoMetadata[]
  outputs: IoMetadata[]
}
