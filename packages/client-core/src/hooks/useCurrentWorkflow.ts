import { useContext, useEffect, useState } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, LumyWorkflow } from '../common/types'

export const useCurrentWorkflow = (): [LumyWorkflow] => {
  const context = useContext(BackEndContext)
  const [workflow, setWorkflow] = useState<LumyWorkflow>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.Workflow.codec.Updated.decode, msg => setWorkflow(msg.workflow))
    context.subscribe(Target.Workflow, handler)

    // get the most recent data on first use
    context.sendMessage(Target.Workflow, Messages.Workflow.codec.GetCurrent.encode(null))

    return () => context.unsubscribe(Target.Workflow, handler)
  }, [])

  return [workflow]
}
