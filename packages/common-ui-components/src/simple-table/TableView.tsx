import React, { useState } from 'react'
import { Table as ArrowTable, Utf8Vector } from 'apache-arrow'

import { TableStats, TabularDataFilter } from '@dharpa-vre/client-core'

import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'
import Checkbox from '@material-ui/core/Checkbox'

import useStyles from './TableView.styles'

export interface TableProps<S> {
  table: ArrowTable
  requiredFields?: string[]
  tableStats: TableStats
  filter?: TabularDataFilter
  onFilterChanged?: (filter: TabularDataFilter) => void
  selections?: S[]
  onSelectionsChanged?: (selections: S[]) => void
  selectionRowIndex?: number
  usePagination?: boolean
  useSelection?: boolean
  caption?: string
}

const defaultNumberRowsPerPage = 5

/**
 * Just an example how to deal with Arrow Table.
 * https://observablehq.com/@theneuralbit/introduction-to-apache-arrow
 */
export const TableView = <S,>({
  table,
  requiredFields,
  tableStats,
  selections,
  filter,
  usePagination = false,
  onFilterChanged,
  onSelectionsChanged,
  selectionRowIndex = 0,
  useSelection = false,
  caption
}: TableProps<S>): JSX.Element => {
  const classes = useStyles()

  const [pageNumber, setPageNumber] = useState(0)
  const [numRowsPerPage, setNumRowsPerPage] = useState(filter?.pageSize ?? defaultNumberRowsPerPage)

  const handlePageNumberChange = (event: unknown, newPageNumber: number) => {
    setPageNumber(newPageNumber)
    onFilterChanged?.({
      pageSize: numRowsPerPage,
      offset: newPageNumber * numRowsPerPage
    })
  }

  const handleNumRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumRowsPerPage(+event.target.value)
    setPageNumber(0)
    onFilterChanged?.({
      pageSize: +event.target.value,
      offset: 0
    })
  }

  const handleRowSelection = (id: S, isSelected: boolean) => {
    if (isSelected) onSelectionsChanged(selections.concat([id]))
    else onSelectionsChanged(selections.filter(item => item !== id))
  }

  return (
    <Paper variant="outlined" className={classes.paperWrapper}>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} stickyHeader aria-label="table caption sticky">
          {!!caption?.length && <caption style={{ textAlign: 'center' }}>{caption}</caption>}
          <TableHead>
            <TableRow>
              {useSelection && <TableCell align="center"></TableCell>}
              {requiredFields
                ? requiredFields.map((field, idx) => (
                    <TableCell key={idx} align="center">
                      {field}
                    </TableCell>
                  ))
                : (table?.schema?.fields ?? []).map((field, idx) => (
                    <TableCell key={idx} align="center">
                      {field.name}
                    </TableCell>
                  ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {[...table].map((row, rowIndex) => (
              <TableRow className={classes.row} key={rowIndex}>
                {useSelection && (
                  <TableCell className={classes.borderless} align="center">
                    <Checkbox
                      className={classes.checkbox}
                      color="primary"
                      checked={selections.includes(row[selectionRowIndex])}
                      onChange={e => handleRowSelection(row[selectionRowIndex], e.target.checked)}
                    />
                  </TableCell>
                )}
                {requiredFields
                  ? requiredFields.map((field, index) => {
                      let value = table?.getColumn(field).toArray()[rowIndex]
                      if (value instanceof Utf8Vector) value = Array.from(value).join(', ')
                      return (
                        <TableCell className={classes.borderless} key={index} align="center">
                          {value}
                        </TableCell>
                      )
                    })
                  : Array.from({ length: table?.numCols ?? 0 }, (_, i) => i).map(index => (
                      <TableCell className={classes.borderless} key={index}>
                        {row[index]}
                      </TableCell>
                    ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {usePagination && (
        <TablePagination
          component="div"
          count={tableStats.rowsCount}
          page={pageNumber}
          rowsPerPage={numRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          onChangePage={handlePageNumberChange}
          onChangeRowsPerPage={handleNumRowsPerPageChange}
        />
      )}
    </Paper>
  )
}
