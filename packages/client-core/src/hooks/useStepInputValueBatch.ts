import { useContext, useState, useEffect } from 'react'
import { Table } from 'apache-arrow'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TableStats, TabularDataFilter } from '../common/types'
import { deserializeValue } from '../common/codec'

export type BatchFilter = TabularDataFilter

export const useStepInputValueBatch = (
  stepId: string,
  inputId: string,
  filter: BatchFilter,
  viewId = 'default'
): [Table, TableStats] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<Table>()
  const [lastStats, setLastStats] = useState<TableStats>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.TabularInputValueUpdated.decode, content => {
      if (content?.stepId === stepId && content?.inputId === inputId && content?.viewId == viewId) {
        const [tableStats, table] = deserializeValue<TableStats, Table>(content.value)
        setLastValue(table)
        setLastStats(tableStats)
      }
    })
    context.subscribe(Target.ModuleIO, handler)

    return () => {
      context.unsubscribe(Target.ModuleIO, handler)
      context.sendMessage(
        Target.ModuleIO,
        Messages.ModuleIO.codec.UnregisterTabularInputView.encode({
          viewId,
          inputId,
          stepId
        })
      )
    }
  }, [])

  useEffect(() => {
    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetTabularInputValue.encode({
        viewId,
        stepId,
        inputId,
        filter
      })
    )
  }, [filter, stepId, inputId])

  return [lastValue, lastStats]
}
