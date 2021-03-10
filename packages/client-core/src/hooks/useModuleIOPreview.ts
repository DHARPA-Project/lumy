import { useContext, useEffect, useState } from 'react'
import {
  BackEndContext,
  IBackEndContext,
  MessageEnvelope,
  NoneMessage,
  Target,
  ModuleIOMessages
} from '../common/context'
import { Messages } from '../common/types'

type Updated = Messages.ModuleIO.Preview.Updated

/**
 * Returns the most recent input and output data of the module.
 * Data is updated every time it is reprocessed on the backend.
 */
export const useModuleIOPreview = (stepId: string): [Updated] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<Updated>()

  useEffect(() => {
    const handler = <T>(ctx: IBackEndContext, msg: MessageEnvelope<T>) => {
      if (msg.action === 'previewUpdated') {
        const message = (msg as unknown) as Updated
        if (message.id === stepId) {
          setLastValue(message)
        }
      }
    }
    context.subscribe(Target.ModuleIO, handler)

    const getIOPreviewMessage: ModuleIOMessages.Preview.Get = {
      action: 'previewGet',
      content: { id: stepId }
    }
    // get the most recent data on first use
    context.sendMessage<typeof getIOPreviewMessage.content, NoneMessage>(Target.ModuleIO, getIOPreviewMessage)

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId])

  return [lastValue]
}
