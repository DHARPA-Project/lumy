import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

export const useStepInputValue = <T>(stepId: string, inputId: string): [T, (p: T) => Promise<void>] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<T>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.InputValuesUpdated.decode, content => {
      if (content?.id === stepId) {
        if (inputId in content.inputValues) setLastValue((content.inputValues[inputId] as unknown) as T)
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetInputValues.encode({ id: stepId, inputIds: [inputId] })
    )

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId, inputId])

  const update = (inputValue: T): Promise<void> => {
    const message = Messages.ModuleIO.codec.UpdateInputValues.encode({
      id: stepId,
      inputValues: {
        [inputId]: inputValue
      }
    })
    return context.sendMessage(Target.ModuleIO, message).then(() => null)
  }

  return [lastValue, update]
}
