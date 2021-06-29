import React from 'react'
import { Utf8, Utf8Vector } from 'apache-arrow'
import { RowLike } from 'apache-arrow/type'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'

import { useDataRepositoryItemValue, DataRepositoryItemsTable } from '@dharpa-vre/client-core'
import { LoadingIndicator } from '@dharpa-vre/client-ui'

import useStyles from './DataSourceRow.styles'

import { TableView } from '../components/TableView'

type DataSourceRowProps = {
  repositoryItemBatch: DataRepositoryItemsTable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repositoryItem: RowLike<any>
  rowIndex: number
  selectedItemIds: string[]
  setSelectedItemIds: (value: string[]) => Promise<void>
}

const DataSourceRow = ({
  repositoryItemBatch,
  repositoryItem,
  rowIndex,
  selectedItemIds,
  setSelectedItemIds
}: DataSourceRowProps): JSX.Element => {
  const classes = useStyles()

  const dataSourceId = String(repositoryItemBatch?.getColumn('id').toArray()[rowIndex])
  const [dataSourceContentTable, dataSourceContentMetadata] = useDataRepositoryItemValue(
    dataSourceId,
    { pageSize: 5 }
  ) // prettier-ignore

  const dataSourceName = repositoryItemBatch?.getColumn('alias').toArray()[rowIndex]
  let columnsInDataSource: Utf8 | number | string = repositoryItemBatch?.getColumn('columnNames').toArray()[
    rowIndex
  ]
  if (columnsInDataSource instanceof Utf8Vector)
    columnsInDataSource = Array.from(columnsInDataSource).join(', ')

  const handleRowSelection = (id: string, isSelected: boolean) => {
    if (isSelected) setSelectedItemIds(selectedItemIds.concat([id]))
    else setSelectedItemIds(selectedItemIds.filter(item => item !== id))
  }

  return (
    <TableRow className={classes.row} key={rowIndex}>
      <TableCell className={classes.borderless} align="center">
        <Checkbox
          className={classes.checkbox}
          color="primary"
          checked={selectedItemIds.includes(repositoryItem[0])}
          onChange={event => handleRowSelection(repositoryItem[0], event.target.checked)}
        />
      </TableCell>
      <TableCell
        className={classes.borderless}
        align="center"
        onClick={() => console.log(`file ${dataSourceId} clicked`)}
      >
        <Tooltip
          arrow
          classes={{
            tooltip: classes.tooltip,
            arrow: classes.tooltipArrow
          }}
          title={
            dataSourceContentTable ? (
              <TableView
                table={dataSourceContentTable}
                tableStats={dataSourceContentMetadata}
                selections={selectedItemIds}
                onSelectionsChanged={setSelectedItemIds}
              />
            ) : (
              <LoadingIndicator />
            )
          }
        >
          <span>{dataSourceName}</span>
        </Tooltip>
      </TableCell>
      <TableCell className={classes.borderless} align="center">
        {columnsInDataSource}
      </TableCell>
    </TableRow>
  )
}

export default DataSourceRow
