import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'

export const useStepTabularInputValue = <T>(
  stepId: string,
  inputId: string,
  pageSize = 10,
  offset = 0
): [T] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<T>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.TabularInputValueUpdated.decode, content => {
      if (content?.id === stepId && content?.inputId === inputId)
        setLastValue((content.value as unknown) as T)
    })
    context.subscribe(Target.ModuleIO, handler)

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [])

  useEffect(() => {
    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetTabularInputValue.encode({
        id: stepId,
        inputId,
        filter: { pageSize, offset }
      })
    )
  }, [pageSize, offset, stepId, inputId])

  return [lastValue]
}
