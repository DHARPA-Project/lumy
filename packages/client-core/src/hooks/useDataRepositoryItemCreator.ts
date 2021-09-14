import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, WorkflowExecutionStatus } from '../common/types'

type ItemStatus = 'new' | 'creating' | 'created' | 'error'
export type ItemCreationMethod = 'lumy.table_from_file' | 'lumy.table.local_file'

type InputBuilderFn = (filePath: string) => Record<string, unknown>

const inputsBuilders: Record<ItemCreationMethod, InputBuilderFn> = {
  'lumy.table_from_file': (path: string) => ({ path }),
  'lumy.table.local_file': (path: string) => ({ path })
}

type AddItemFn = (method: ItemCreationMethod, filePath: string, workflowId: string) => void

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
  }, [requestId])

  const addItem = (method: ItemCreationMethod, filePath: string, workflowId: string) => {
    const inputs = inputsBuilders[method](filePath)
    const msg = Messages.Workflow.codec.Execute.encode({
      moduleName: method,
      requestId,
      save: true,
      inputs,
      workflowId
    })
    context.sendMessage(Target.Workflow, msg)
    setStatus('creating')
  }

  return [status, addItem, lastErrorMessage]
}
