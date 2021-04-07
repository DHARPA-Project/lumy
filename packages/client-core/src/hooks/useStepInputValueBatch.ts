import { useContext, useState, useEffect } from 'react'
import { Table } from 'apache-arrow'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages } from '../common/types'
import { TabularDataFilter } from '../common/types'
import { deserializeValue } from '../common/codec'

export type BatchFilter = TabularDataFilter

export const useStepInputValueBatch = (stepId: string, inputId: string, filter: BatchFilter): [Table] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<Table>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.TabularInputValueUpdated.decode, content => {
      if (content?.id === stepId && content?.inputId === inputId) {
        const [, table] = deserializeValue<unknown, Table>(content.value)
        setLastValue(table)
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    return () => context.unsubscribe(Target.ModuleIO, handler)
  }, [])

  useEffect(() => {
    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetTabularInputValue.encode({
        id: stepId,
        inputId,
        filter
      })
    )
  }, [filter, stepId, inputId])

  return [lastValue]
}
