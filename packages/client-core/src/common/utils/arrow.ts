import { Table } from 'apache-arrow'
import { DataType, RowLike } from 'apache-arrow/type'

/**
 * Because arrow was built to be zero copy,
 * converting tables to table while filtering by rows
 * is not easy. It can be done with a predicate, but there
 * is no way to get a new table after filtering, only original table
 * with predicate filter applied can be iterated. It's ok
 * for now because creating filtered tables is unlikely to
 * be needed on the frontend apart from mock implementation.
 */
export function filterTable<T extends { [key: string]: DataType }>(
  table: Table<T>,
  matchesFn: (row: RowLike<T>) => boolean
): Table<T> {
  const rowsIndices = [...new Array(table.length).keys()]
  const matchedIndices = rowsIndices.filter(idx => matchesFn(table.get(idx)))

  const filteredTable = matchedIndices.reduce(
    (acc, i) => acc.concat(table.slice(i, i + 1)),
    table.slice(0, 0)
  )
  return filteredTable
}
