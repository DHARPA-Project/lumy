import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

/**
 * Use current value of the input. The value may be undefined if not set.
 * If the value is a big complex type (e.g. Table), only a stats object
 * is returned. Use the `view` hook to retrieve a view of the data.
 *
 * The `update` function returned by the hook can be used to update values
 * of `disconnected` inputs. If an input is connected, update is not performed.
 *
 * Update is performed on disconnected big complex types. But you still need
 * a view to get the current value.
 *
 * @param stepId ID of the step
 * @param inputId ID of the input
 */
export const useStepInputValue = <InputType>(
  stepId: string,
  inputId: string
): [InputType, (value: InputType) => Promise<void>] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<InputType>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.InputValuesUpdated.decode, content => {
      if (content?.id === stepId) {
        if (inputId in content.inputValues)
          setLastValue((content.inputValues[inputId] as unknown) as InputType)
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetInputValues.encode({ id: stepId, inputIds: [inputId] })
    )

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId, inputId])

  const update = (inputValue: InputType): Promise<void> => {
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
