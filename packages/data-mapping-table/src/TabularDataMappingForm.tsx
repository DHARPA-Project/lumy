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

import TabularDataMappingRow from './TabularDataMappingRow'

type CorpusStructure = DataRepositoryItemStructure
type CorpusTableType = ArrowTable<CorpusStructure>

export interface IRequiredDataSetProp {
  name: string
  requiredFields: string[]
}

type TabularDataMappingFormProps = {
  corpusPage: CorpusTableType
  requiredDataSets: IRequiredDataSetProp[]
  isDataSetMappedInDataSource: (dataSourceId: string, dataSetName: string) => boolean
  getFieldMappedToColumn: (dataSourceId: string, selectedColumn: string) => string
  getColumnMappedToField: (dataSourceId: string, fieldName: string) => string
  clearMappingsForDataSet: (dataSourceId: string, dataSetName: string) => void
  setColumnMappedToField: (dataSourceId: string, fieldName: string, columnName: string) => void
}

const tableCaptionText =
  '* Map data sources to data sets required for this workflow. The first column lists the names of the (re)sources from which you can extract data. The headings of the other columns are the names of the data sets required for this workflow. The labels of the selection fields are the names of the required data fields. The options on the drop-down list correspond to columns found in your data (re)source.'

export const TabularDataMappingForm = ({
  corpusPage,
  requiredDataSets,
  isDataSetMappedInDataSource,
  getFieldMappedToColumn,
  getColumnMappedToField,
  clearMappingsForDataSet,
  setColumnMappedToField
}: TabularDataMappingFormProps): JSX.Element => {
  const classes = useStyles()

  return (
    <form className={classes.root}>
      <TableContainer className={classes.tableContainer} component={Paper} variant="outlined">
        <Table className={classes.table} stickyHeader aria-label="table caption sticky">
          <caption style={{ textAlign: 'right' }}>{tableCaptionText}</caption>
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
                getFieldMappedToColumn={getFieldMappedToColumn}
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
