import { useContext, useEffect, useState } from 'react'
import { BackEndContext, Target, handlerAdapter } from '../common/context'
import { ModuleIO } from '../common/types/messages'

/**
 * Returns the most recent input and output data of the module.
 * Data is updated every time it is reprocessed on the backend.
 */
export const useModuleIOPreview = (stepId: string): [ModuleIO.PreviewUpdated] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<ModuleIO.PreviewUpdated>()

  useEffect(() => {
    const handler = handlerAdapter(ModuleIO.codec.PreviewUpdated.decode, content => {
      if (content.id === stepId) setLastValue(content)
    })
    context.subscribe(Target.ModuleIO, handler)

    // get the most recent data on first use
    context.sendMessage(Target.ModuleIO, ModuleIO.codec.GetPreview.encode({ id: stepId }))

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [stepId])

  return [lastValue]
}
