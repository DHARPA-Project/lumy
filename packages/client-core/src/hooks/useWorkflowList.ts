import { useContext, useEffect, useState } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'
import { WorkflowListItem } from '../common/types/generated'

export const useWorkflowList = (includeWorkflow = false): [WorkflowListItem[], boolean] => {
  const context = useContext(BackEndContext)
  const [items, setItems] = useState<WorkflowListItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handler = handlerAdapter(Messages.Workflow.codec.WorkflowList.decode, msg => {
      setItems(msg.workflows)
      setIsLoading(false)
    })
    context.subscribe(Target.Workflow, handler)

    context.sendMessage(
      Target.Workflow,
      Messages.Workflow.codec.GetWorkflowList.encode({
        includeWorkflow
      })
    )

    return () => context.unsubscribe(Target.Workflow, handler)
  }, [])

  return [items, isLoading]
}
