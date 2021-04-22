import { Table } from 'apache-arrow'
import { useContext, useState, useEffect } from 'react'
import { deserializeValue, serialize, serializeFilteredTable } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'
import { ModuleIO } from '../common/types/messages'

/**
 * Use current value of the input. The value may be undefined if not set.
 * If the value is a big complex type (e.g. Table), only a stats object
 * is returned, unless `getFullValue` is set to `true`.
 *
 * WARNING: Use `getFullValue` with care. The whole value will be returned
 * regardless of the size. This may render the browser unresponsive.
 *
 * Alternatively use the `view` hook to retrieve a view of the data.
 *
 * The `update` function returned by the hook can be used to update values
 * of `disconnected` inputs. If an input is connected, calling `update` does nothing.
 *
 * Update is performed on disconnected big complex types. But you still need
 * a view to get the current value.
 *
 * @param stepId ID of the step
 * @param inputId ID of the input
 */
export const useStepInputValue = <InputType, StatsType = unknown>(
  stepId: string,
  inputId: string,
  getFullValue?: boolean
): [InputType, (value: InputType) => Promise<void>, StatsType] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<InputType>()
  const [lastStats, setLastStats] = useState<StatsType>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.InputValuesUpdated.decode, content => {
      if (content?.id === stepId) {
        const values = content.inputValues ?? {}
        if (inputId in values) {
          const [stats, value] = deserializeValue<StatsType, InputType>(content.inputValues[inputId])
          setLastValue(value)
          setLastStats(stats)
        }
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    const getMsg: ModuleIO.GetInputValues = { id: stepId, inputIds: [inputId] }

    if (getFullValue != null) {
      getMsg.fullValueInputIds = [inputId]
    }

    context.sendMessage(Target.ModuleIO, Messages.ModuleIO.codec.GetInputValues.encode(getMsg))

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId, inputId])

  const update = (inputValue: InputType): Promise<void> => {
    const message = Messages.ModuleIO.codec.UpdateInputValues.encode({
      id: stepId,
      inputValues: {
        [inputId]:
          inputValue instanceof Table ? serializeFilteredTable(inputValue, inputValue) : serialize(inputValue)
      }
    })
    return context.sendMessage(Target.ModuleIO, message).then(() => null)
  }

  return [lastValue, update, lastStats]
}
