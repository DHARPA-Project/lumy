import { createContext, useContext, useState, useEffect } from 'react'

/**
 * Communication targets (channels) used to exchange messages
 * between the backend and the frontend.
 */
export enum Target {
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
export interface IMessageWithAction {
  action: string
}

/**
 * Context interface that manages communication with the backend.
 * All communications handled here are within the context
 * of the current module only. All workflow-related communication
 * is handled elsewhere.
 */
export interface IModuleContext {
  moduleId: string
  isAvailable: boolean
  sendMessage<T extends IMessageWithAction, U extends IMessageWithAction>(target: string, msg: T): Promise<U>
  subscribe<T extends IMessageWithAction>(
    target: Target,
    callback: (ctx: IModuleContext, msg: T) => void
  ): void
  unsubscribe<T extends IMessageWithAction>(
    target: Target,
    callback: (ctx: IModuleContext, msg: T) => void
  ): void
  onAvailabilityChanged(callback: (isAvailable: boolean) => void): void
}

const ModuleContext = createContext<IModuleContext>(null)
ModuleContext.displayName = 'VREModuleContext'

export const ModuleContextProvider = ModuleContext.Provider

export interface NoneMessage extends IMessageWithAction {
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
  export interface Updated<T> extends IMessageWithAction {
    action: 'updated'
    moduleId: string
    parameters: T
  }

  /**
   * Sent by frontend when parameters need to be updated.
   */
  export interface Update<T> extends IMessageWithAction {
    action: 'update'
    moduleId: string
    moduleParameters: T
  }

  /**
   * Sent by frontend when parameters state needs to be retrieved from the backend.
   */
  export interface Get extends IMessageWithAction {
    action: 'get'
    moduleId: string
  }
}

/**
 * Hook for working with model parameters: get parameters from the backend
 * or update them on the backend.
 *
 * Works the same way as @see {React#useState}.
 */
export const useModuleParameters = <T>(): [T, (p: T) => Promise<T>] => {
  const context = useContext(ModuleContext)
  const [lastValue, setLastValue] = useState<T>()

  useEffect(() => {
    const handler = (ctx: IModuleContext, msg: ModuleParametersMessages.Updated<T>) => {
      if (msg?.moduleId === context.moduleId) setLastValue(msg.parameters)
    }
    context.subscribe<ModuleParametersMessages.Updated<T>>(Target.ModuleParameters, handler)

    const getParametersMessage: ModuleParametersMessages.Get = {
      action: 'get',
      moduleId: context.moduleId
    }
    context
      .sendMessage<ModuleParametersMessages.Get, ModuleParametersMessages.Updated<T>>(
        Target.ModuleParameters,
        getParametersMessage
      )
      .then((response: ModuleParametersMessages.Updated<T>) => {
        if (response?.parameters != null && response?.moduleId === context.moduleId)
          setLastValue(response?.parameters)
      })

    return () => context.unsubscribe(Target.ModuleParameters, handler)
  }, [])

  const update = <M extends T>(parameters: M): Promise<M> => {
    const message: ModuleParametersMessages.Update<M> = {
      action: 'update',
      moduleId: context.moduleId,
      moduleParameters: parameters
    }
    return context
      .sendMessage<typeof message, ModuleParametersMessages.Updated<M>>(Target.ModuleParameters, message)
      .then((response: ModuleParametersMessages.Updated<M>) => {
        if (response?.moduleId === context.moduleId && response?.parameters != null) {
          setLastValue(response.parameters)
          return response.parameters
        }
      })
  }

  return [lastValue, update]
}

/**
 * Module data container.
 */
export interface DataContainer<I, O> {
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
  export interface Updated<I, O> extends DataContainer<I, O>, IMessageWithAction {
    action: 'updated'
    moduleId: string
  }

  /**
   * Sent by frontend when it needs the latest state of calculated data.
   */
  export interface GetPreview extends IMessageWithAction {
    action: 'get'
    moduleId: string
  }
}

export interface UseModuleIOParameters {
  preview?: boolean
}

/**
 * Returns the most recent input and output data of the module.
 * Data is updated every time it is reprocessed on the backend.
 */
export const useModuleIO = <I, O>(parameters?: UseModuleIOParameters): [I, O, number] => {
  if (parameters?.preview !== true) throw new Error('Only "preview" is supported at the moment')

  const context = useContext(ModuleContext)
  const [lastValue, setLastValue] = useState<ModuleDataMessages.Updated<I, O>>()

  useEffect(() => {
    const handler = (ctx: IModuleContext, msg: ModuleDataMessages.Updated<I, O>) => {
      if (msg.moduleId === context.moduleId) {
        setLastValue(msg)
      }
    }
    context.subscribe(Target.ModuleIOPreview, handler)

    const getIOPreviewMessage: ModuleDataMessages.GetPreview = {
      moduleId: context.moduleId,
      action: 'get'
    }
    // get the most recent data on first use
    context.sendMessage<ModuleDataMessages.GetPreview, NoneMessage>(
      Target.ModuleIOPreview,
      getIOPreviewMessage
    )

    return () => {
      context.unsubscribe(Target.ModuleIOPreview, handler)
    }
  }, [])

  return [lastValue?.inputs, lastValue?.output, lastValue?.fraction]
}

export const useBackendIsReady = (): boolean => {
  const context = useContext(ModuleContext)
  const [isReady, setIsReady] = useState(context.isAvailable)

  useEffect(() => {
    context.onAvailabilityChanged(setIsReady)
  }, [])

  return isReady
}
