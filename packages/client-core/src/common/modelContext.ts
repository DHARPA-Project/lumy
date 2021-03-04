import { createContext, useContext, useState, useEffect } from 'react'
import { Workflow } from './model'

/**
 * Communication targets (channels) used to exchange messages
 * between the backend and the frontend.
 */
export enum Target {
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
  ModuleIOPreview = 'module_io_preview'
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
  sendMessage<T, U>(target: string, msg: MessageEnvelope<T>): Promise<MessageEnvelope<U>>
  subscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void
  unsubscribe<T>(target: Target, callback: (ctx: IBackEndContext, msg: MessageEnvelope<T>) => void): void
  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void
}

const BackEndContext = createContext<IBackEndContext>(null)
BackEndContext.displayName = 'VREBackEndContext'

export const BackEndContextProvider = BackEndContext.Provider

export interface NoneMessage extends MessageEnvelope<void> {
  action: 'none'
}

interface ModuleParametersContent<T> {
  moduleId: string
  parameters: T
}

/**
 * Messages sent via the parameters target channel @see {Target#ModuleParameters}
 */
export namespace ModuleParametersMessages {
  /**
   * Sent by backend when parameters for the module are updated
   * or a "get" request is sent.
   */
  export type Updated<T> = MessageEnvelope<ModuleParametersContent<T>, 'updated'>

  /**
   * Sent by frontend when parameters need to be updated.
   */
  export type Update<T> = MessageEnvelope<ModuleParametersContent<T>, 'update'>

  /**
   * Sent by frontend when parameters state needs to be retrieved from the backend.
   */
  export type Get = MessageEnvelope<{ moduleId: string }, 'get'>
}

/**
 * Hook for working with model parameters: get parameters from the backend
 * or update them on the backend.
 *
 * Works the same way as @see {React#useState}.
 */
export const useModuleParameters = <T>(moduleId: string): [T, (p: T) => Promise<T>] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<T>()

  useEffect(() => {
    const handler = <M>(ctx: IBackEndContext, msg: MessageEnvelope<M>) => {
      if (msg.action == 'updated') {
        const { content } = (msg as unknown) as ModuleParametersMessages.Updated<T>
        if (content?.moduleId === moduleId) setLastValue(content?.parameters)
      }
    }
    context.subscribe<T>(Target.ModuleParameters, handler)

    const getParametersMessage: ModuleParametersMessages.Get = {
      action: 'get',
      content: { moduleId }
    }
    context
      .sendMessage<typeof getParametersMessage.content, ModuleParametersContent<T>>(
        Target.ModuleParameters,
        getParametersMessage
      )
      .then(response => {
        if (response?.content?.parameters != null && response?.content?.moduleId === moduleId)
          setLastValue(response?.content?.parameters)
      })

    return () => context.unsubscribe(Target.ModuleParameters, handler)
  }, [moduleId])

  const update = <M extends T>(parameters: M): Promise<M> => {
    const message: ModuleParametersMessages.Update<M> = {
      action: 'update',
      content: {
        moduleId,
        parameters
      }
    }
    return context
      .sendMessage<typeof message.content, ModuleParametersContent<M>>(Target.ModuleParameters, message)
      .then(response => {
        if (response?.content?.moduleId === moduleId) {
          setLastValue(response?.content?.parameters)
          return response?.content?.parameters
        }
      })
  }

  return [lastValue, update]
}

/**
 * Module data container.
 */
export interface DataContainer<I, O> {
  moduleId: string
  /** Module inputs. */
  inputs: I
  /** Module outputs. */
  output: O
  /** Fraction of all data represented in this object. (0-1) */
  fraction?: number
}

/**
 * Messages sent via the data target channel @see {Target#ModuleIOPreview}
 */
export namespace ModuleDataMessages {
  /**
   * Sent by backend when data has been reprocessed or
   * when a "get" request is sent.
   */
  export type Updated<I, O> = MessageEnvelope<DataContainer<I, O>, 'updated'>

  /**
   * Sent by frontend when it needs the latest state of calculated data.
   */
  export type GetPreview = MessageEnvelope<{ moduleId: string }, 'get'>
}

export interface UseModuleIOParameters {
  preview?: boolean
}

/**
 * Returns the most recent input and output data of the module.
 * Data is updated every time it is reprocessed on the backend.
 */
export const useModuleIO = <I, O>(moduleId: string, parameters?: UseModuleIOParameters): [I, O, number] => {
  if (parameters?.preview !== true) throw new Error('Only "preview" is supported at the moment')

  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<DataContainer<I, O>>()

  useEffect(() => {
    const handler = <T>(ctx: IBackEndContext, msg: MessageEnvelope<T>) => {
      if (msg.action == 'updated') {
        const { content } = (msg as unknown) as ModuleDataMessages.Updated<I, O>
        if (content?.moduleId === moduleId) {
          setLastValue(content)
        }
      }
    }
    context.subscribe(Target.ModuleIOPreview, handler)

    const getIOPreviewMessage: ModuleDataMessages.GetPreview = {
      action: 'get',
      content: { moduleId }
    }
    // get the most recent data on first use
    context.sendMessage<typeof getIOPreviewMessage.content, NoneMessage>(
      Target.ModuleIOPreview,
      getIOPreviewMessage
    )

    return () => context.unsubscribe(Target.ModuleIOPreview, handler)
  }, [moduleId])

  return [lastValue?.inputs, lastValue?.output, lastValue?.fraction]
}

export const useBackendIsReady = (): boolean => {
  const context = useContext(BackEndContext)
  const [isReady, setIsReady] = useState(context.isAvailable)

  useEffect(() => {
    context.onAvailabilityChanged(setIsReady)
  }, [])

  return isReady
}

/**
 * Messages sent via the workflow channel @see {Target#Workflow}
 */
export namespace WorkflowMessages {
  /**
   * Sent by backend when data has been reprocessed or
   * when a "get" request is sent.
   */
  export type Updated = MessageEnvelope<{ workflow: Workflow }, 'updated'>

  /**
   * Sent by frontend when it needs the latest state of calculated data.
   */
  export type GetCurrent = MessageEnvelope<void, 'get'>
}

export const useCurrentWorkflow = (): [Workflow] => {
  const context = useContext(BackEndContext)
  const [workflow, setWorkflow] = useState<Workflow>()

  useEffect(() => {
    const handler = <T>(ctx: IBackEndContext, msg: MessageEnvelope<T>) => {
      if (msg.action === 'updated') {
        const { content } = (msg as unknown) as WorkflowMessages.Updated
        setWorkflow(content?.workflow)
      }
    }
    context.subscribe(Target.Workflow, handler)

    const getCurrentWorkflowMessage: WorkflowMessages.GetCurrent = {
      action: 'get'
    }
    // get the most recent data on first use
    context.sendMessage(Target.Workflow, getCurrentWorkflowMessage)

    return () => {
      context.unsubscribe(Target.Workflow, handler)
    }
  }, [])

  return [workflow]
}
