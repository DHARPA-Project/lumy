import { useContext, useState, useEffect } from 'react'
import objectHash from 'object-hash'
import { deserialize, serializeToDataValue } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TabularDataFilter } from '../common/types'

const getHash = (filter?: TabularDataFilter): string => (filter == null ? '' : objectHash(filter))

/**
 * Use current value of the input. The value may be undefined if not set or
 * not received from the backend yet. If the value is a big complex type
 * (e.g. Table), only a stats object is returned and the actual valus is
 * kept `undefined`, unless `filter` is provided.
 *
 * The `update` function returned by the hook can be used to update values
 * of `disconnected` inputs. If an input is connected, calling `update` does nothing.
 * Big complex types can be updated too.
 *
 * The filter defines what slice of big type to return. In case of a table
 * this can be used for pagination. If a `fullValue` is set in the filter,
 * the whole value is returned. Use this with care - if the value is really big
 * it may hang up the browser.
 *
 * If filter is used with simple values, it will be ignored.
 *
 * @param stepId ID of the step
 * @param inputId ID of the input
 * @param filter optional filter for complex types
 */
export const useStepInputValue = <InputType, StatsType = unknown>(
  stepId: string,
  inputId: string,
  filter?: TabularDataFilter
): [InputType | undefined, (value: InputType) => Promise<void>, StatsType | undefined] => {
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
