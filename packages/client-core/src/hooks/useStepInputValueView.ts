import { useContext, useState, useEffect } from 'react'
import { DataType, Table } from 'apache-arrow'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, TableStats, TabularDataFilter } from '../common/types'
import { deserializeValue } from '../common/codec'

export type ViewFilter = TabularDataFilter

/**
 * Returns a view of a big complex type (Table only at the moment).
 * A view requires a filter which limits the amount of data returned.
 * It also requires a `viewId` which is registered with the backend when
 * the hook comes into a scope and unregistered when it leaves the scope.
 * `viewId` allows us to use different views of the same data (e.g. one for
 * a table view and another one for a graph).
 * `viewId` falls back to "default" if not set. It's advisable to always set
 * it to avoid multiple components using the "default" view and having it
 * accidentally unregistered if one component leaves the scope.
 *
 * @param stepId ID of the step
 * @param inputId ID of the input
 * @param filter filter
 * @param viewId ID of the view
 */
export const useStepInputValueView = <
  T extends {
    [key: string]: DataType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = any
>(
  stepId: string,
  inputId: string,
  filter: ViewFilter,
  viewId = 'default'
): [Table<T>, TableStats] => {
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
    if (filter == null || stepId == null || inputId == null) return
    context.sendMessage(
      Target.ModuleIO,
      Messages.ModuleIO.codec.GetTabularInputValue.encode({
        viewId,
        stepId,
        inputId,
        filter
      })
    )
  }, [JSON.stringify(filter), stepId, inputId])

  return [lastValue, lastStats]
}
