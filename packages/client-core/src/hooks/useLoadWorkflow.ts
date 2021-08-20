import { useContext, useEffect, useState } from 'react'
import { BackEndContext, Target, handlerAdapter } from '../common/context'
import { LumyWorkflow, LumyWorkflowLoadStatus } from '../common/types'
import { Workflow } from '../common/types/messages'

export type LoadProgress = Workflow.LumyWorkflowLoadProgress

export const useLoadWorkflow = (workflow: LumyWorkflow | string): [LoadProgress[], boolean] => {
  const context = useContext(BackEndContext)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<LoadProgress[]>([])

  useEffect(() => {
    if (workflow == null) return

    const handler = handlerAdapter(Workflow.codec.LumyWorkflowLoadProgress.decode, msg => {
      setIsLoading(msg.status == LumyWorkflowLoadStatus.Loading)
      setMessages(messages.concat(msg))
    })

    context.subscribe(Target.Workflow, handler)
    setIsLoading(true)
    setMessages([])
    context.sendMessage(
      Target.Workflow,
      Workflow.codec.LoadLumyWorkflow.encode({
        workflow
      })
    )

    return () => context.unsubscribe(Target.Workflow, handler)
  }, [JSON.stringify(workflow)])

  return [messages, isLoading]
}
