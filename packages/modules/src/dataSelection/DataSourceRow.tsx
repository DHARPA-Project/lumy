import React from 'react'
import { RowLike } from 'apache-arrow/type'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Checkbox from '@material-ui/core/Checkbox'

import { useDataRepositoryItemValue, DataRepositoryItemStructure } from '@dharpa-vre/client-core'
import { LoadingIndicator, TableView } from '@dharpa-vre/client-ui'

import useStyles from './DataSourceRow.styles'

type RepositoryItemId = DataRepositoryItemStructure['id']['TValue']

type DataSourceRowProps = {
  repositoryItem: RowLike<DataRepositoryItemStructure>
  selectedItemIds: RepositoryItemId[]
  setSelectedItemIds: (value: RepositoryItemId[]) => Promise<void>
}

const DataSourceRow = ({
  repositoryItem,
  selectedItemIds,
  setSelectedItemIds
}: DataSourceRowProps): JSX.Element => {
  const classes = useStyles()

  const [
    dataSourceContentTable,
    dataSourceContentMetadata
  ] = useDataRepositoryItemValue(repositoryItem.id, { pageSize: 5}) // prettier-ignore

  const handleRowSelection = (id: string, isSelected: boolean) => {
    if (isSelected) setSelectedItemIds(selectedItemIds.concat([id]))
    else setSelectedItemIds(selectedItemIds.filter(item => item !== id))
  }

  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.borderless} align="center">
        <Checkbox
          className={classes.checkbox}
          color="primary"
          checked={selectedItemIds.includes(repositoryItem.id)}
          onChange={event => handleRowSelection(repositoryItem.id, event.target.checked)}
        />
      </TableCell>
      <TableCell className={classes.borderless} align="center">
        <Tooltip
          arrow
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
          <span>{repositoryItem.label}</span>
        </Tooltip>
      </TableCell>
      <TableCell className={classes.borderless} align="center">
        {[...(repositoryItem.columnNames ?? [])].join(', ')}
      </TableCell>
    </TableRow>
  )
}

export default DataSourceRow
