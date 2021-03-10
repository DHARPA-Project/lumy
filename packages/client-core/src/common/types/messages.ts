import {
  MsgError,
  MsgExecutionState,
  MsgParametersGet,
  MsgParametersUpdate,
  MsgParametersUpdated,
  MsgWorkflowUpdated,
  MsgModuleIOPreviewGet,
  MsgModuleIOPreviewUpdated,
  MsgModuleIOPreviewParametersUpdate
} from './generated'

export namespace Parameters {
  export type Get = MsgParametersGet
  export interface Update<T> extends Omit<MsgParametersUpdate, 'parameters'> {
    parameters: T
  }
  export interface Updated<T> extends Omit<MsgParametersUpdated, 'parameters'> {
    parameters: T
  }
}

export namespace Workflow {
  export type Updated = MsgWorkflowUpdated
}

export namespace Activity {
  export type Error = MsgError
  export type ExecutionState = MsgExecutionState
}

export namespace ModuleIO {
  export namespace Preview {
    export type Get = MsgModuleIOPreviewGet
    export type Updated = MsgModuleIOPreviewUpdated
    export type ParametersUpdate = MsgModuleIOPreviewParametersUpdate
  }
}
