import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

/**
 * Hook for working with model parameters: get parameters from the backend
 * or update them on the backend.
 */
export const useModuleParameters = <T>(stepId: string): [T, (p: T) => Promise<void>] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<T>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.Parameters.codec.Updated.decode, content => {
      if (content?.id === stepId) setLastValue((content.parameters as unknown) as T)
    })
    context.subscribe(Target.ModuleParameters, handler)

    context.sendMessage(Target.ModuleParameters, Messages.Parameters.codec.Get.encode({ id: stepId }))

    return () => context.unsubscribe(Target.ModuleParameters, handler)
  }, [stepId])

  const update = (parameters: T): Promise<void> => {
    const message = Messages.Parameters.codec.Update.encode({
      id: stepId,
      parameters: (parameters as unknown) as void
    })
    return context.sendMessage(Target.ModuleParameters, message).then(() => null)
  }

  return [lastValue, update]
}
