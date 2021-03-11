import { Codec } from './base'
import {
  MsgError,
  MsgExecutionState,
  MsgParametersGet,
  MsgParametersUpdate,
  MsgParametersUpdated,
  MsgWorkflowWorkflowUpdated,
  MsgModuleIOGetPreview,
  MsgModuleIOPreviewUpdated,
  MsgModuleIOUpdatePreviewParameters,
  MsgParametersCreateSnapshot,
  MsgParametersSnapshots,
  MsgProgress,
  MsgModuleIOExecute,
  MsgModuleIOOutputUpdated,
  MsgNotesGetNotes,
  MsgNotesAdd,
  MsgNotesNotes
} from './generated'

export namespace Parameters {
  export type Get = MsgParametersGet
  export interface Update<T> extends Omit<MsgParametersUpdate, 'parameters'> {
    parameters: T
  }
  export interface Updated<T> extends Omit<MsgParametersUpdated, 'parameters'> {
    parameters: T
  }
  export interface CreateSnapshot<T> extends Omit<MsgParametersCreateSnapshot, 'parameters'> {
    parameters: T
  }
  export type Snapshots = MsgParametersSnapshots

  export namespace codec {
    export const Get = Codec<Get>('Get')
    export const Update = Codec<Update<void>>('Update')
    export const Updated = Codec<Updated<void>>('Updated')
    export const CreateSnapshot = Codec<CreateSnapshot<void>>('CreateSnapshot')
    export const Snapshots = Codec<Snapshots>('Snapshots')
  }
}

export namespace Workflow {
  export type Updated = MsgWorkflowWorkflowUpdated
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
  export type OutputUpdated = MsgModuleIOOutputUpdated

  export namespace codec {
    export const GetPreview = Codec<GetPreview>('GetPreview')
    export const PreviewUpdated = Codec<PreviewUpdated>('PreviewUpdated')
    export const UpdatePreviewParameters = Codec<UpdatePreviewParameters>('UpdatePreviewParameters')
    export const Execute = Codec<Execute>('Execute')
    export const OutputUpdated = Codec<OutputUpdated>('OutputUpdated')
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
