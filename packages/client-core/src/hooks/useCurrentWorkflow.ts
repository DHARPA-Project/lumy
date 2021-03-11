import { useContext, useEffect, useState } from 'react'
import { BackEndContext, IBackEndContext, MessageEnvelope, Target, WorkflowMessages } from '../common/context'
import { Workflow } from '../common/types'

export const useCurrentWorkflow = (): [Workflow] => {
  const context = useContext(BackEndContext)
  const [workflow, setWorkflow] = useState<Workflow>()

  useEffect(() => {
    const handler = <T>(ctx: IBackEndContext, msg: MessageEnvelope<T>) => {
      if (msg.action === 'Updated') {
        const { content } = (msg as unknown) as WorkflowMessages.Updated
        setWorkflow(content?.workflow)
      }
    }
    context.subscribe(Target.Workflow, handler)

    const getCurrentWorkflowMessage: WorkflowMessages.GetCurrent = {
      action: 'GetCurrent'
    }
    // get the most recent data on first use
    context.sendMessage(Target.Workflow, getCurrentWorkflowMessage)

    return () => {
      context.unsubscribe(Target.Workflow, handler)
    }
  }, [])

  return [workflow]
}
