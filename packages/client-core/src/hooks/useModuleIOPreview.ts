import { useContext, useEffect, useState } from 'react'
import {
  BackEndContext,
  DataContainer,
  IBackEndContext,
  MessageEnvelope,
  ModuleDataMessages,
  NoneMessage,
  Target
} from '../common/modelContext'

/**
 * Returns the most recent input and output data of the module.
 * Data is updated every time it is reprocessed on the backend.
 */
export const useModuleIOPreview = <I, O>(moduleId: string): [I, O, number] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<DataContainer<I, O>>()

  useEffect(() => {
    const handler = <T>(ctx: IBackEndContext, msg: MessageEnvelope<T>) => {
      if (msg.action == 'updated') {
        const { content } = (msg as unknown) as ModuleDataMessages.Updated<I, O>
        if (content?.moduleId === moduleId) {
          setLastValue(content)
        }
      }
    }
    context.subscribe(Target.ModuleIOPreview, handler)

    const getIOPreviewMessage: ModuleDataMessages.GetPreview = {
      action: 'get',
      content: { moduleId }
    }
    // get the most recent data on first use
    context.sendMessage<typeof getIOPreviewMessage.content, NoneMessage>(
      Target.ModuleIOPreview,
      getIOPreviewMessage
    )

    return () => context.unsubscribe(Target.ModuleIOPreview, handler)
  }, [moduleId])

  return [lastValue?.inputs, lastValue?.output, lastValue?.fraction]
}
