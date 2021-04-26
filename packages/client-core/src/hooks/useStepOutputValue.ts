import { useContext, useState, useEffect } from 'react'
import { deserialize } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TabularDataFilter } from '../common/types'
import { getHash } from '../common/utils/hash'

/**
 * Use current value of the output. The value may be undefined if not set.
 * If the value is a big complex type (e.g. Table), only a stats object
 * is returned. Use the `view` hook to retrieve a view of the data.
 *
 * @param stepId ID of the step
 * @param outputId ID of the output
 */
export const useStepOutputValue = <OutputType, StatsType = unknown>(
  stepId: string,
  outputId: string,
  filter?: TabularDataFilter
): [OutputType, StatsType] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<OutputType>()
  const [lastStats, setLastStats] = useState<StatsType>()

  const getValue = () => {
    const msg = Messages.ModuleIO.codec.GetOutputValue.encode({
      stepId,
      outputId,
      filter
    })
    context.sendMessage(Target.ModuleIO, msg)
  }

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.OutputValuesUpdated.decode, content => {
      if (content.stepId === stepId && content.outputIds.includes(outputId)) {
        getValue()
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    const getValueHandler = handlerAdapter(Messages.ModuleIO.codec.OutputValue.decode, content => {
      if (
        content.stepId === stepId &&
        content.outputId === outputId &&
        getHash(content.filter) === getHash(filter)
      ) {
        const [value, stats] = deserialize<OutputType, StatsType>(content.value, content.stats, content.type)
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
  }, [stepId, outputId, getHash(filter)])

  return [lastValue, lastStats]
}
