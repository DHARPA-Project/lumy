import { List, Table, Utf8 } from 'apache-arrow'
import { useContext, useEffect, useState } from 'react'
import { deserialize } from '../common/codec'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { DataRepositoryItemsFilter, TableStats, Messages, DataType } from '../common/types'
import { getHash } from '../common/utils/hash'

export type DataRepositoryItemStructure = {
  id: Utf8
  label: Utf8
  type: Utf8
  columnNames?: List<Utf8>
  columnTypes?: List<Utf8>
  tags?: Utf8
  notes?: Utf8
}

export type DataRepositoryItemsTable = Table<DataRepositoryItemStructure>
export type DataRepositoryItemsStats = TableStats

export const useDataRepository = (
  filter: DataRepositoryItemsFilter
): [DataRepositoryItemsTable, DataRepositoryItemsStats] => {
  const context = useContext(BackEndContext)
  const [lastValue, setLastValue] = useState<DataRepositoryItemsTable>()
  const [lastStats, setLastStats] = useState<DataRepositoryItemsStats>()

  const getValue = () => {
    const msg = Messages.DataRepository.codec.FindItems.encode({
      filter
    })
    context.sendMessage(Target.DataRepository, msg)
  }

  useEffect(() => {
    const handler = handlerAdapter(Messages.DataRepository.codec.Items.decode, content => {
      if (getHash(content.filter) === getHash(filter)) {
        const [table, stats] = deserialize<DataRepositoryItemsTable, DataRepositoryItemsStats>(
          content.items,
          content.stats,
          DataType.Table
        )
        setLastStats(stats)
        setLastValue(table)
      }
    })
    context.subscribe(Target.DataRepository, handler)
    getValue()

    return () => context.unsubscribe(Target.DataRepository, handler)
  }, [getHash(filter)])

  return [lastValue, lastStats]
}
