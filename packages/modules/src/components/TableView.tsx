import { TableStats, ViewFilter } from '@dharpa-vre/client-core'
import { Table } from 'apache-arrow'
import React from 'react'

export interface TableProps<S> {
  table: Table
  tableStats: TableStats
  filter?: ViewFilter
  onFilterChanged?: (filter: ViewFilter) => void
  selections: S[]
  onSelectionsChanged?: (selections: S[]) => void
  selectionRowIndex?: number
  usePagination?: boolean
  useSelection?: boolean
}

/**
 * Just an example how to deal with Arrow Table.
 * https://observablehq.com/@theneuralbit/introduction-to-apache-arrow
 *
 * TODO: Make this table beautiful and move it to a separate file to be reused.
 */
export const TableView = <S,>({
  table,
  tableStats,
  selections,
  filter,
  usePagination = false,
  onFilterChanged,
  onSelectionsChanged,
  selectionRowIndex = 0,
  useSelection = false
}: TableProps<S>): JSX.Element => {
  const pageSize = filter?.pageSize ?? 10
  const pageOffset = filter?.offset ?? 0

  const setPageOffset = (offset: number) =>
    onFilterChanged?.({
      pageSize,
      offset
    })

  const handleRowSelection = (id: S, isSelected: boolean) => {
    if (isSelected) onSelectionsChanged(selections.concat([id]))
    else onSelectionsChanged(selections.filter(item => item !== id))
  }

  const colIndices = [...Array(table.numCols).keys()]

  return (
    <div>
      <table>
        <thead>
          <tr>
            {useSelection ? <th></th> : ''}
            {table.schema.fields.map((f, idx) => (
              <th key={idx}>{f.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...table].map((row, idx) => (
            <tr key={idx}>
              {useSelection ? (
                <td>
                  <input
                    type="checkbox"
                    checked={selections.includes(row[selectionRowIndex])}
                    onChange={e => handleRowSelection(row[selectionRowIndex], e.target.checked)}
                  />
                </td>
              ) : (
                ''
              )}
              {colIndices.map(idx => (
                <td key={idx}>{row[idx]}</td>
              ))}
            </tr>
          ))}
          <tr></tr>
        </tbody>
      </table>
      {/* pagination */}
      {usePagination ? (
        <div>
          <button
            onClick={() => setPageOffset(pageOffset > pageSize ? pageOffset - pageSize : 0)}
            disabled={pageOffset === 0}
          >
            Previous page
          </button>
          <button
            onClick={() => setPageOffset(pageOffset + pageSize)}
            disabled={pageSize + pageOffset >= tableStats.rowsCount}
          >
            Next page
          </button>
          <em>Total: {tableStats.rowsCount}</em>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}