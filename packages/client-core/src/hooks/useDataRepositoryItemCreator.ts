import { useContext, useState, useEffect } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, WorkflowExecutionStatus } from '../common/types'

type DataRegistryItemDescription = {
  name: string
  tags: string
  notes: string
}

type ItemStatus = 'new' | 'creating' | 'created' | 'error'
export type ItemCreationMethod = 'table.from_csv' | 'onboarding.file.import'

type InputBuilderFn = (filePath: string) => Record<string, unknown>

const inputsBuilders: Record<ItemCreationMethod, InputBuilderFn> = {
  'table.from_csv': (path: string) => ({ path }),
  'onboarding.file.import': (path: string) => ({ path })
}

type AddItemFn = (method: ItemCreationMethod, filePath: string, workflowId: string) => void
type UpdateItemFn = (itemId: string, itemValues: DataRegistryItemDescription) => void
type RemoveItemFn = (itemId: string) => void

type ReturnType = [ItemStatus, string | undefined, AddItemFn, UpdateItemFn, RemoveItemFn]

export const useDataRepositoryItemCreator = (requestId: string): ReturnType => {
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

  const updateItem: UpdateItemFn = (itemId: string, itemValues: DataRegistryItemDescription) => {
    console.log(`updating data registry item ${itemId}`)
  }

  const removeItem: RemoveItemFn = (itemId: string) => {
    console.log(`removing data registry item ${itemId}`)
  }

  return [status, lastErrorMessage, addItem, updateItem, removeItem]
}
