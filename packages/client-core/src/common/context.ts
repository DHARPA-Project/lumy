import { createContext } from 'react'
import { ModuleViewProvider } from './modules'
import { IDecode, MessageEnvelope } from './types'

/**
 * Communication targets (channels) used to exchange messages
 * between the backend and the frontend.
 */
export enum Target {
  /**
   * All messages related to core functionality of Lumy:
   * errors, status, etc..
   */
  Activity = 'activity',
  /**
   * Everything about current workflow.
   */
  Workflow = 'workflow',
  /**
   * Used to get preview processed data for the module.
   */
  ModuleIO = 'module_io',
  /**
   * Data repository related messages.
   */
  DataRepository = 'data_repository',
  /**
   * Steps/data notes
   */
  Notes = 'notes'
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

  sendMessage<T, U = void>(target: string, msg: MessageEnvelope<T>): Promise<MessageEnvelope<U>>
  subscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void
  unsubscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void
  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void

  // TODO: the argument may soon change to a structure that includes
  // the files and their metadata.
  addFilesToRepository(files: File[]): Promise<void>
}

export const BackEndContext = createContext<IBackEndContext>(null)
BackEndContext.displayName = 'LumyBackEndContext'

export const BackEndContextProvider = BackEndContext.Provider

export const handlerAdapter = <T, A extends string = string>(
  decoder: IDecode<T, A>,
  handler: (msg: T) => void
) => {
  return (_ctx: IBackEndContext, msg: MessageEnvelope<T, A>): void => {
    const content = decoder(msg)
    if (content !== undefined) handler(content)
  }
}
