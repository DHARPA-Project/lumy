import React, { useState } from 'react'
import { Table as ArrowTable } from 'apache-arrow'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TablePagination from '@material-ui/core/TablePagination'

import {
  ModuleProps,
  useStepInputValue,
  withMockProcessor,
  DataRepositoryItemsFilter,
  useDataRepository,
  DataRepositoryItemStructure,
  DataRepositoryItemsTable,
  arrowUtils,
  MockProcessorResult
} from '@dharpa-vre/client-core'

import useStyles from './DataSelection.styles'

import DataSourceRow from './DataSourceRow'

interface InputValues {
  selectedItemsIds?: string[]
  metadataFields?: string[]
}

interface OutputValues {
  selectedItems?: ArrowTable<Partial<DataRepositoryItemStructure>>
}

const defaultNumberRowsPerPage = 5

const DataSelection = ({ pageDetails: { id: stepId } }: ModuleProps): JSX.Element => {
  const classes = useStyles()

  const [repositoryItemsFilter, setRepositoryItemsFilter] = React.useState<DataRepositoryItemsFilter>({
    pageSize: defaultNumberRowsPerPage,
    types: ['table']
  })
  const [selectedItemsIds = [], setSelectedItemsIds] = useStepInputValue<string[]>(stepId, 'selectedItemsIds')
  const [repositoryItemsBatch, repositoryStats] = useDataRepository(repositoryItemsFilter)

  const updateRepositoryItemsFilter = (filter: DataRepositoryItemsFilter) =>
    setRepositoryItemsFilter({ pageSize: defaultNumberRowsPerPage, ...filter, types: ['table'] })

  const [pageNumber, setPageNumber] = useState(0)
  const [numRowsPerPage, setNumRowsPerPage] = useState(
    repositoryItemsFilter?.pageSize ?? defaultNumberRowsPerPage
  )

  const handlePageNumberChange = (event: unknown, newPageNumber: number) => {
    setPageNumber(newPageNumber)
    updateRepositoryItemsFilter?.({
      pageSize: numRowsPerPage,
      offset: newPageNumber * numRowsPerPage
    })
  }

  const handleNumRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumRowsPerPage(+event.target.value)
    setPageNumber(0)
    updateRepositoryItemsFilter?.({
      pageSize: +event.target.value,
      offset: 0
    })
  }

  return (
    <Container classes={{ root: classes.dataSelectionContainer }} maxWidth="lg">
      {repositoryItemsBatch != null && repositoryStats != null && (
        <Paper variant="outlined" className={classes.paperWrapper}>
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} stickyHeader aria-label="table caption sticky">
              <caption style={{ textAlign: 'center' }}>
                Select the repository items that contain data about the nodes and edges
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tableHeadCell}></TableCell>
                  <TableCell align="center" className={classes.tableHeadCell}>
                    data source name
                  </TableCell>
                  <TableCell align="center" className={classes.tableHeadCell}>
                    columns in data source
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.tableBody}>
                {[...repositoryItemsBatch].map((row, rowIndex) => (
                  <DataSourceRow
                    repositoryItem={row}
                    selectedItemIds={selectedItemsIds}
                    setSelectedItemIds={setSelectedItemsIds}
                    key={rowIndex}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={repositoryStats.rowsCount}
            page={pageNumber}
            rowsPerPage={numRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            onChangePage={handlePageNumberChange}
            onChangeRowsPerPage={handleNumRowsPerPageChange}
          />
        </Paper>
      )}
    </Container>
  )
}

type KnownMetadataFields = keyof DataRepositoryItemStructure

const mockProcessor = (
  { selectedItemsIds = [], metadataFields }: InputValues,
  dataRepositoryTable?: DataRepositoryItemsTable
): MockProcessorResult<InputValues, OutputValues> => {
  if (dataRepositoryTable == null) return

  const fields = new Set(
    ((metadataFields ?? []) as KnownMetadataFields[]).concat(['id', 'label', 'columnNames'])
  )

  const selectedItems = arrowUtils.filterTable(dataRepositoryTable.select(...fields), row =>
    selectedItemsIds.includes(row.id)
  )
  return { outputs: { selectedItems } }
}

export default withMockProcessor(DataSelection, mockProcessor)
