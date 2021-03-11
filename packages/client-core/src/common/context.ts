import { createContext } from 'react'
import { ModuleViewProvider } from './modules'
import { Messages } from './types'

/**
 * Communication targets (channels) used to exchange messages
 * between the backend and the frontend.
 */
export enum Target {
  /**
   * All messages related to core functionality of the VRE:
   * errors, status, etc..
   */
  Activity = 'activity',
  /**
   * Everything about current workflow.
   */
  Workflow = 'workflow',
  /**
   * Used to updated module parameters with the backend
   * and get the most recent parameters from the backend.
   */
  ModuleParameters = 'module_parameters',
  /**
   * Used to get preview processed data for the module.
   */
  ModuleIO = 'module_io'
}

/**
 * Base class for messages sent up and down the target channels.
 */
export interface MessageEnvelope<T, A extends string = string> {
  action: A
  content?: T
}

/**
 * Context interface that manages communication with the backend.
 * All communications handled here are within the context
 * of the current module only. All workflow-related communication
 * is handled elsewhere.
 */
export interface IBackEndContext {
  isAvailable: boolean
  moduleViewProvider: ModuleViewProvider

  sendMessage<T, U>(target: string, msg: MessageEnvelope<T>): Promise<MessageEnvelope<U>>
  subscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void
  unsubscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void
  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void
}

export const BackEndContext = createContext<IBackEndContext>(null)
BackEndContext.displayName = 'VREBackEndContext'

export const BackEndContextProvider = BackEndContext.Provider

export interface NoneMessage extends MessageEnvelope<void> {
  action: 'none'
}

/**
 * Messages sent via the parameters target channel @see {Target#ModuleParameters}
 */
export namespace ModuleParametersMessages {
  /**
   * Sent by backend when parameters for the module are updated
   * or a "get" request is sent.
   */
  export type Updated<T> = MessageEnvelope<Messages.Parameters.Updated<T>, 'Updated'>

  /**
   * Sent by frontend when parameters need to be updated.
   */
  export type Update<T> = MessageEnvelope<Messages.Parameters.Update<T>, 'Update'>

  /**
   * Sent by frontend when parameters state needs to be retrieved from the backend.
   */
  export type Get = MessageEnvelope<Messages.Parameters.Get, 'Get'>

  export namespace Snapshot {
    export type Create<T> = MessageEnvelope<Messages.Parameters.CreateSnapshot<T>, 'CreateSnapshot'>
    export type List = MessageEnvelope<Messages.Parameters.Snapshots, 'Snapshots'>
  }
}

/**
 * Messages sent via the IO target channel @see {Target#ModuleIO}
 */
export namespace ModuleIOMessages {
  export type GetPreview = MessageEnvelope<Messages.ModuleIO.GetPreview, 'GetPreview'>
  export type PreviewUpdated = MessageEnvelope<Messages.ModuleIO.PreviewUpdated, 'PreviewUpdated'>
  export type UpdatePreviewParameters = MessageEnvelope<
    Messages.ModuleIO.UpdatePreviewParameters,
    'UpdatePreviewParameters'
  >

  export type Execute = MessageEnvelope<Messages.ModuleIO.Execute, 'Execute'>
  export type OutputUpdated = MessageEnvelope<Messages.ModuleIO.OutputUpdated, 'OutputUpdated'>
}

/**
 * Messages sent via the workflow channel @see {Target#Workflow}
 */
export namespace WorkflowMessages {
  /**
   * Sent by backend when data has been reprocessed or
   * when a "get" request is sent.
   */
  export type Updated = MessageEnvelope<Messages.Workflow.Updated, 'Updated'>

  /**
   * Sent by frontend when it needs the latest state of calculated data.
   */
  export type GetCurrent = MessageEnvelope<void, 'GetCurrent'>
}

export namespace ActivityMessages {
  export type Error = MessageEnvelope<Messages.Activity.Error, 'Error'>
  export type ExecutionState = MessageEnvelope<Messages.Activity.ExecutionState, 'State'>
}

export namespace NotesMessages {
  export type GetList = MessageEnvelope<Messages.Notes.GetNotes, 'GetNotes'>
  export type List = MessageEnvelope<Messages.Notes.Notes, 'Notes'>
  export type Add = MessageEnvelope<Messages.Notes.Add, 'Add'>
}
