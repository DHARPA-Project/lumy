import { useContext, useState, useEffect } from 'react'
import { Table } from 'apache-arrow'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TableStats, TabularDataFilter } from '../common/types'
import { deserializeValue } from '../common/codec'

type ViewFilter = TabularDataFilter

/**
 * Returns a view of a big complex type (Table only at the moment).
 * A view requires a filter which limits the amount of data returned.
 * It also required a `viewId` which is registered with the backend when
 * the hook comes into a scope and unregistered when it leaves the scope.
 * `viewId` allows us to use different views of the same data (e.g. one for
 * a table view and another one for a graph).
 * `viewId` falls back to "default" if not set. It's advisable to always set
 * it to avoid multiple components using the "default" view and having it
 * accidentally unregistered if one component leaves the scope.
 *
 * @param stepId ID of the step
 * @param outputId ID of the output
 * @param filter filter
 * @param viewId ID of the view
 */
export const useStepOutputValueView = (
  stepId: string,
  outputId: string,
  filter: ViewFilter,
  viewId = 'default'
): [Table, TableStats] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<Table>()
  const [lastStats, setLastStats] = useState<TableStats>()

  useEffect(() => {
    const handler = handlerAdapter(Messages.ModuleIO.codec.TabularOutputValueUpdated.decode, content => {
      if (content?.stepId === stepId && content?.outputId === outputId && content?.viewId == viewId) {
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
        Messages.ModuleIO.codec.UnregisterTabularOutputView.encode({
          viewId,
          outputId,
          stepId
        })
      )
    }
  }, [])

  useEffect(() => {
    if (filter == null || stepId == null || outputId == null) return
    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetTabularOutputValue.encode({
        viewId,
        stepId,
        outputId,
        filter
      })
    )
  }, [filter, stepId, outputId])

  return [lastValue, lastStats]
}
