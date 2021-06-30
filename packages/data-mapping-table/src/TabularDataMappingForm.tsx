import React from 'react'

import { Table as ArrowTable } from 'apache-arrow'

import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import { DataRepositoryItemStructure } from '@dharpa-vre/client-core'

import useStyles from './TabularDataMappingForm.styles'

import TabularDataMappingRow, { IRequiredDataSet } from './TabularDataMappingRow'

type CorpusStructure = DataRepositoryItemStructure
type CorpusTableType = ArrowTable<CorpusStructure>

export type IRequiredDataSetProp = IRequiredDataSet

type TabularDataMappingFormProps = {
  corpusPage: CorpusTableType
  requiredDataSets: IRequiredDataSetProp[]
  isDataSetMappedInDataSource: (dataSourceId: string, dataSetName: string) => boolean
  getColumnMappedToField: (dataSourceId: string, fieldName: string) => string
  clearMappingsForDataSet: (dataSourceId: string, dataSetName: string) => void
  setColumnMappedToField: (dataSourceId: string, fieldName: string, columnName: string) => void
  tableCaption?: string
}

export const TabularDataMappingForm = ({
  corpusPage,
  requiredDataSets,
  isDataSetMappedInDataSource,
  getColumnMappedToField,
  clearMappingsForDataSet,
  setColumnMappedToField,
  tableCaption
}: TabularDataMappingFormProps): JSX.Element => {
  const classes = useStyles()

  return (
    <form className={classes.root}>
      <TableContainer className={classes.tableContainer} component={Paper} variant="outlined">
        <Table className={classes.table} stickyHeader aria-label="table caption sticky">
          {tableCaption && <caption style={{ textAlign: 'center' }}>{tableCaption}</caption>}

          <TableHead>
            <TableRow>
              <TableCell>(re)source</TableCell>
              {requiredDataSets.map(dataSet => (
                <TableCell key={dataSet.name} align="center">
                  {dataSet.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBody}>
            {[...(corpusPage ?? [])].map(row => (
              <TabularDataMappingRow
                key={row.id}
                rowId={row.id}
                rowName={row.alias}
                columnNames={[...(row.columnNames ?? [])]}
                requiredDataSets={requiredDataSets}
                isDataSetMappedInDataSource={isDataSetMappedInDataSource}
                getColumnMappedToField={getColumnMappedToField}
                clearMappingsForDataSet={clearMappingsForDataSet}
                setColumnMappedToField={setColumnMappedToField}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  )
}
