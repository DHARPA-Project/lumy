import { useContext, useEffect, useState } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, LumyWorkflow, WorkflowMetadata } from '../common/types'

export const useCurrentWorkflow = (): [LumyWorkflow, WorkflowMetadata | undefined, boolean] => {
  const context = useContext(BackEndContext)
  const [workflow, setWorkflow] = useState<LumyWorkflow>()
  const [metadata, setMetadata] = useState<WorkflowMetadata>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const handler = handlerAdapter(Messages.Workflow.codec.Updated.decode, msg => {
      setWorkflow(msg.workflow)
      setMetadata(msg.metadata)
      msg.metadata
      setIsLoading(false)
    })
    context.subscribe(Target.Workflow, handler)

    // get the most recent data on first use
    context.sendMessage(Target.Workflow, Messages.Workflow.codec.GetCurrent.encode(null))

    return () => context.unsubscribe(Target.Workflow, handler)
  }, [])

  return [workflow, metadata, isLoading]
}
