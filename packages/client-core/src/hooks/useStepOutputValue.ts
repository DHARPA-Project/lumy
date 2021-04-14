import { useContext, useState, useEffect } from 'react'
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
export const useStepOutputValue = <OutputType>(stepId: string, outputId: string): [OutputType] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<OutputType>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.OutputValuesUpdated.decode, content => {
      if (content?.id === stepId) {
        if (outputId in content.outputValues)
          setLastValue((content.outputValues[outputId] as unknown) as OutputType)
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetOutputValues.encode({ id: stepId, outputIds: [outputId] })
    )

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId, outputId])

  return [lastValue]
}
