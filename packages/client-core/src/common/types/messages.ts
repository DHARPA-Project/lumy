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
}

export namespace Workflow {
  export type Updated = MsgWorkflowWorkflowUpdated
}

export namespace Activity {
  export type Error = MsgError
  export type ExecutionState = MsgExecutionState
  export type Progress = MsgProgress
}

export namespace ModuleIO {
  export type GetPreview = MsgModuleIOGetPreview
  export type PreviewUpdated = MsgModuleIOPreviewUpdated
  export type UpdatePreviewParameters = MsgModuleIOUpdatePreviewParameters
  export type Execute = MsgModuleIOExecute
  export type OutputUpdated = MsgModuleIOOutputUpdated
}

export namespace Notes {
  export type GetNotes = MsgNotesGetNotes
  export type Notes = MsgNotesNotes
  export type Add = MsgNotesAdd
}
