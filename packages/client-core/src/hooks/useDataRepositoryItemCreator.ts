import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, WorkflowExecutionStatus } from '../common/types'

type ItemStatus = 'new' | 'creating' | 'created' | 'error'
type Method = 'table.from_csv' | 'onboarding.file.import'

type InputBuilderFn = (filePath: string) => Record<string, unknown>

const inputsBuilders: Record<Method, InputBuilderFn> = {
  'table.from_csv': (path: string) => ({ path }),
  'onboarding.file.import': (path: string) => ({ path })
}

type AddItemFn = (method: Method, filePath: string, workflowId: string) => void

export const useDataRepositoryItemCreator = (
  requestId: string
): [ItemStatus, AddItemFn, string | undefined] => {
  const context = useContext(BackEndContext)
  const [status, setStatus] = useState<ItemStatus>('new')
  const [lastErrorMessage, setLastErrorMessage] = useState<string>(undefined)

  useEffect(() => {
    setStatus('new')
  }, [requestId])

  useEffect(() => {
    const workflowExecutionHandler = handlerAdapter(
      Messages.Workflow.codec.ExecutionResult.decode,
      content => {
        // only interested about this request.
        if (content.requestId !== requestId) return

        if (content.status === WorkflowExecutionStatus.Ok) {
          setStatus('created')
          setLastErrorMessage(undefined)
        } else if (content.status === WorkflowExecutionStatus.Error) {
          setStatus('error')
          setLastErrorMessage(content.errorMessage)
        }
      }
    )

    context.subscribe(Target.Workflow, workflowExecutionHandler)

    return () => context.unsubscribe(Target.Workflow, workflowExecutionHandler)
  }, [])

  const addItem = (method: Method, filePath: string, workflowId: string) => {
    const inputs = inputsBuilders[method](filePath)
    const msg = Messages.Workflow.codec.Execute.encode({
      moduleName: method,
      requestId,
      save: true,
      inputs,
      workflowId
    })
    context.sendMessage(Target.Workflow, msg)
  }

  return [status, addItem, lastErrorMessage]
}
