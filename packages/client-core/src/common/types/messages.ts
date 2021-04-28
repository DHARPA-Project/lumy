import { Codec } from './base'
import {
  MsgError,
  MsgExecutionState,
  MsgWorkflowUpdated,
  MsgModuleIOGetPreview,
  MsgModuleIOPreviewUpdated,
  MsgModuleIOUpdatePreviewParameters,
  MsgParametersCreateSnapshot,
  MsgParametersSnapshots,
  MsgProgress,
  MsgModuleIOExecute,
  MsgNotesGetNotes,
  MsgNotesAdd,
  MsgNotesNotes,
  MsgModuleIOInputValuesUpdated,
  MsgModuleIOUpdateInputValues,
  MsgModuleIOOutputValuesUpdated,
  MsgModuleIOGetInputValue,
  MsgModuleIOInputValue,
  MsgModuleIOGetOutputValue,
  MsgModuleIOOutputValue
} from './generated'

/**
 * TODO: This should move somewhere else. Target "Parameters" has been removed.
 */
export namespace Parameters {
  export interface CreateSnapshot<T> extends Omit<MsgParametersCreateSnapshot, 'parameters'> {
    parameters: T
  }
  export type Snapshots = MsgParametersSnapshots

  export namespace codec {
    export const CreateSnapshot = Codec<CreateSnapshot<void>>('CreateSnapshot')
    export const Snapshots = Codec<Snapshots>('Snapshots')
  }
}

export namespace Workflow {
  export type Updated = MsgWorkflowUpdated
  export type GetCurrent = void

  export namespace codec {
    export const Updated = Codec<Updated>('Updated')
    export const GetCurrent = Codec<GetCurrent>('GetCurrent')
  }
}

export namespace Activity {
  export type Error = MsgError
  export type ExecutionState = MsgExecutionState
  export type Progress = MsgProgress

  export namespace codec {
    export const Error = Codec<Error>('Error')
    export const ExecutionState = Codec<ExecutionState>('ExecutionState')
    export const Progress = Codec<Progress>('Progress')
  }
}

export namespace ModuleIO {
  export type GetPreview = MsgModuleIOGetPreview
  export type PreviewUpdated = MsgModuleIOPreviewUpdated
  export type UpdatePreviewParameters = MsgModuleIOUpdatePreviewParameters
  export type Execute = MsgModuleIOExecute
  export type InputValuesUpdated = MsgModuleIOInputValuesUpdated
  export type OutputValuesUpdated = MsgModuleIOOutputValuesUpdated
  export type UpdateInputValues = MsgModuleIOUpdateInputValues
  export type GetInputValue = MsgModuleIOGetInputValue
  export type InputValue = MsgModuleIOInputValue
  export type GetOutputValue = MsgModuleIOGetOutputValue
  export type OutputValue = MsgModuleIOOutputValue

  export namespace codec {
    export const GetPreview = Codec<GetPreview>('GetPreview')
    export const PreviewUpdated = Codec<PreviewUpdated>('PreviewUpdated')
    export const UpdatePreviewParameters = Codec<UpdatePreviewParameters>('UpdatePreviewParameters')
    export const Execute = Codec<Execute>('Execute')
    export const InputValuesUpdated = Codec<InputValuesUpdated>('InputValuesUpdated')
    export const OutputValuesUpdated = Codec<OutputValuesUpdated>('OutputValuesUpdated')
    export const UpdateInputValues = Codec<UpdateInputValues>('UpdateInputValues')
    export const GetInputValue = Codec<GetInputValue>('GetInputValue')
    export const InputValue = Codec<InputValue>('InputValue')
    export const GetOutputValue = Codec<GetOutputValue>('GetOutputValue')
    export const OutputValue = Codec<OutputValue>('OutputValue')
  }
}

export namespace Notes {
  export type GetNotes = MsgNotesGetNotes
  export type Notes = MsgNotesNotes
  export type Add = MsgNotesAdd

  export namespace codec {
    export const GetNotes = Codec<GetNotes>('GetNotes')
    export const Notes = Codec<Notes>('Notes')
    export const Add = Codec<Add>('Add')
  }
}
