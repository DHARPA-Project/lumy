import { useContext, useState, useEffect } from 'react'
import { deserialize, serializeToDataValue } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TabularDataFilter } from '../common/types'
import { getHash } from '../common/utils/hash'

/**
 * Use current value of the input. The value may be undefined if not set.
 * If the value is a big complex type (e.g. Table), only a stats object
 * is returned, unless `filter` is provided.
 *
 * The `update` function returned by the hook can be used to update values
 * of `disconnected` inputs. If an input is connected, calling `update` does nothing.
 *
 * Update is performed on disconnected big complex types.
 *
 * @param stepId ID of the step
 * @param inputId ID of the input
 * @param filter optional filter for complex types
 */
export const useStepInputValue = <InputType, StatsType = unknown>(
  stepId: string,
  inputId: string,
  filter?: TabularDataFilter
): [InputType, (value: InputType) => Promise<void>, StatsType] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<InputType>()
  const [lastStats, setLastStats] = useState<StatsType>()

  const getValue = () => {
    const msg = Messages.ModuleIO.codec.GetInputValue.encode({
      stepId,
      inputId,
      filter
    })
    context.sendMessage(Target.ModuleIO, msg)
  }

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.InputValuesUpdated.decode, content => {
      if (content.stepId === stepId && content.inputIds.includes(inputId)) {
        getValue()
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    const getValueHandler = handlerAdapter(Messages.ModuleIO.codec.InputValue.decode, content => {
      if (
        content.stepId === stepId &&
        content.inputId === inputId &&
        getHash(content.filter) === getHash(filter)
      ) {
        const [value, stats] = deserialize<InputType, StatsType>(content.value, content.stats, content.type)
        setLastValue(value)
        setLastStats(stats)
      }
    })

    context.subscribe(Target.ModuleIO, getValueHandler)

    // get value straight away
    getValue()

    return () => {
      context.unsubscribe(Target.ModuleIO, handler)
      context.unsubscribe(Target.ModuleIO, getValueHandler)
    }
  }, [stepId, inputId, getHash(filter)])

  const update = (inputValue: InputType): Promise<void> => {
    const message = Messages.ModuleIO.codec.UpdateInputValues.encode({
      stepId,
      inputValues: {
        [inputId]: serializeToDataValue(inputValue)
      }
    })
    return context.sendMessage(Target.ModuleIO, message).then(() => null)
  }

  return [lastValue, update, lastStats]
}
