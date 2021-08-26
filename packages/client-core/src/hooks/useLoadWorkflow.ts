import { useContext, useEffect, useState } from 'react'
import { BackEndContext, Target, handlerAdapter } from '../common/context'
import { LumyWorkflow, LumyWorkflowLoadStatus } from '../common/types'
import { Workflow } from '../common/types/messages'

export type LoadProgress = Workflow.LumyWorkflowLoadProgress

export const useLoadWorkflow = (
  workflow: LumyWorkflow | string
): [LoadProgress[], LumyWorkflowLoadStatus] => {
  const context = useContext(BackEndContext)
  const [status, setStatus] = useState<LumyWorkflowLoadStatus>()
  const [messages, setMessages] = useState<LoadProgress[]>([])

  useEffect(() => {
    if (workflow == null) return

    const handler = handlerAdapter(Workflow.codec.LumyWorkflowLoadProgress.decode, msg => {
      setStatus(msg.status)
      setMessages(messages => messages.concat(msg))
    })

    context.subscribe(Target.Workflow, handler)
    setStatus(LumyWorkflowLoadStatus.Loading)
    setMessages([])
    context.sendMessage(
      Target.Workflow,
      Workflow.codec.LoadLumyWorkflow.encode({
        workflow
      })
    )

    return () => context.unsubscribe(Target.Workflow, handler)
  }, [JSON.stringify(workflow)])

  return [messages, status]
}
