import React from 'react'
import { ModuleProps, useStepTabularInputValue } from '@dharpa-vre/client-core'
import { Table } from 'apache-arrow'

interface InputValues {
  repositoryItems?: unknown
}

interface OutputValues {
  selectedItems?: unknown
}

type Props = ModuleProps<InputValues, OutputValues>

const DataSelection = ({ step }: Props): JSX.Element => {
  const pageSize = 10
  const [pageOffset, setPageOffset] = React.useState(0)
  const [repositoryItemsPage] = useStepTabularInputValue<Table>(
    step.id,
    'repositoryItems',
    pageSize,
    pageOffset
  )
  return (
    <div key={step.id}>
      [placeholder for the <em>data selection</em> module]
      {repositoryItemsPage == null ? '' : <TableView table={repositoryItemsPage} />}
      <button
        onClick={() => setPageOffset(pageOffset > pageSize ? pageOffset - pageSize : 0)}
        disabled={pageOffset === 0}
      >
        Previous page
      </button>
      <button onClick={() => setPageOffset(pageOffset + pageSize)}>Next page</button>
    </div>
  )
}

export default DataSelection

/**
 * Just an example how to deal with Arrow Table.
 * https://observablehq.com/@theneuralbit/introduction-to-apache-arrow
 */
const TableView = ({ table }: { table: Table }): JSX.Element => {
  const colIndices = [...Array(table.numCols).keys()]

  return (
    <table>
      <thead>
        <tr>
          {table.schema.fields.map((f, idx) => (
            <th key={idx}>{f.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...table].map((row, idx) => (
          <tr key={idx}>
            {colIndices.map(idx => (
              <td key={idx}>{row[idx]}</td>
            ))}
          </tr>
        ))}
        <tr></tr>
      </tbody>
    </table>
  )
}
