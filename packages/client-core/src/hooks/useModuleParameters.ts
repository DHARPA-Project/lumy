import { useContext, useState, useEffect } from 'react'
import {
  BackEndContext,
  IBackEndContext,
  MessageEnvelope,
  ModuleParametersMessages,
  Target
} from '../common/context'
import { Messages } from '../common/types'

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
        if (content?.id === moduleId) setLastValue(content?.parameters)
      }
    }
    context.subscribe<T>(Target.ModuleParameters, handler)

    const getParametersMessage: ModuleParametersMessages.Get = {
      action: 'get',
      content: { id: moduleId }
    }
    context
      .sendMessage<typeof getParametersMessage.content, Messages.Parameters.Updated<T>>(
        Target.ModuleParameters,
        getParametersMessage
      )
      .then(response => {
        if (response?.content?.parameters != null && response?.content?.id === moduleId)
          setLastValue(response?.content?.parameters)
      })

    return () => context.unsubscribe(Target.ModuleParameters, handler)
  }, [moduleId])

  const update = <M extends T>(parameters: M): Promise<M> => {
    const message: ModuleParametersMessages.Update<M> = {
      action: 'update',
      content: {
        id: moduleId,
        parameters
      }
    }
    return context
      .sendMessage<typeof message.content, Messages.Parameters.Updated<M>>(Target.ModuleParameters, message)
      .then(response => {
        if (response?.content?.id === moduleId) {
          setLastValue(response?.content?.parameters)
          return response?.content?.parameters
        }
      })
  }

  return [lastValue, update]
}
