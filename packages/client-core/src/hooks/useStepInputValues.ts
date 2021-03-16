import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

export const useStepInputValues = <T>(stepId: string): [T, (p: T) => Promise<void>] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<T>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.InputValuesUpdated.decode, content => {
      if (content?.id === stepId) setLastValue((content.inputValues as unknown) as T)
    })
    context.subscribe(Target.ModuleIO, handler)

    context.sendMessage(Target.ModuleIO, Messages.ModuleIO.codec.GetInputValues.encode({ id: stepId }))

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId])

  const update = (inputValues: T): Promise<void> => {
    const message = Messages.ModuleIO.codec.UpdateInputValues.encode({
      id: stepId,
      inputValues: (inputValues as unknown) as Messages.ModuleIO.InputValuesUpdated['inputValues']
    })
    return context.sendMessage(Target.ModuleIO, message).then(() => null)
  }

  return [lastValue, update]
}
