import { useContext, useState, useEffect } from 'react'
import objectHash from 'object-hash'
import { deserialize } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TabularDataFilter } from '../common/types'

const getHash = (filter?: TabularDataFilter): string => (filter == null ? '' : objectHash(filter))

/**
 * Use current value of the output. The value may be undefined if not set or
 * not received from the backend yet. If the value is a big complex type
 * (e.g. Table), only a stats object is returned and the actual valus is
 * kept `undefined`, unless `filter` is provided.
 *
 * The filter defines what slice of big type to return. In case of a table
 * this can be used for pagination. If a `fullValue` is set in the filter,
 * the whole value is returned. Use this with care - if the value is really big
 * it may hang up the browser.
 *
 * If filter is used with simple values, it will be ignored.
 *
 * @param stepId ID of the step
 * @param outputId ID of the output
 * @param filter optional filter for complex types
 */
export const useStepOutputValue = <OutputType, StatsType = unknown>(
  stepId: string,
  outputId: string,
  filter?: TabularDataFilter
): [OutputType | undefined, StatsType | undefined] => {
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
