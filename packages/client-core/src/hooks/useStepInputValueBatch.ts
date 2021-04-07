import { useContext, useState, useEffect } from 'react'
import { Table } from 'apache-arrow'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TableStats, TabularDataFilter } from '../common/types'
import { deserializeValue } from '../common/codec'

export type BatchFilter = TabularDataFilter

export const useStepInputValueBatch = (
  stepId: string,
  inputId: string,
  filter: BatchFilter
): [Table, TableStats] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<Table>()
  const [lastStats, setLastStats] = useState<TableStats>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.TabularInputValueUpdated.decode, content => {
      if (content?.id === stepId && content?.inputId === inputId) {
        const [tableStats, table] = deserializeValue<TableStats, Table>(content.value)
        setLastValue(table)
        setLastStats(tableStats)
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

  return [lastValue, lastStats]
}
