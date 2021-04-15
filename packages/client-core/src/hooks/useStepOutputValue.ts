import { useContext, useState, useEffect } from 'react'
import { deserializeValue } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

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
  getFullValue?: boolean
): [OutputType, StatsType] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<OutputType>()
  const [lastStats, setLastStats] = useState<StatsType>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.OutputValuesUpdated.decode, content => {
      if (content?.id === stepId) {
        if (outputId in content.outputValues) {
          const [stats, value] = deserializeValue<StatsType, OutputType>(content.outputValues[outputId])
          setLastValue(value)
          setLastStats(stats)
        }
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    const getMsg: Messages.ModuleIO.GetOutputValues = { id: stepId, outputIds: [outputId] }

    if (getFullValue != null) {
      getMsg.fullValueOutputIds = [outputId]
    }

    context.sendMessage(Target.ModuleIO, Messages.ModuleIO.codec.GetOutputValues.encode(getMsg))

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId, outputId])

  return [lastValue, lastStats]
}
