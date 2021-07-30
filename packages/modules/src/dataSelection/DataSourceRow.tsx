import React, { useState } from 'react'
import { RowLike } from 'apache-arrow/type'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Popover from '@material-ui/core/Popover'
import Checkbox from '@material-ui/core/Checkbox'

import { useDataRepositoryItemValue, DataRepositoryItemStructure } from '@dharpa-vre/client-core'
import { TableView, LoadingIndicator } from '@dharpa-vre/common-ui-components'

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

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  const handleRowSelection = (id: string, isSelected: boolean) => {
    if (isSelected) setSelectedItemIds(selectedItemIds.concat([id]))
    else setSelectedItemIds(selectedItemIds.filter(item => item !== id))
  }

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setPopoverAnchorEl(null)
  }

  const isPopoverOpen = Boolean(popoverAnchorEl)
  const popoverId = isPopoverOpen ? 'data-source-content-preview-popover' : undefined

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
        <Tooltip arrow title="click to open content preview">
          <span onClick={handleOpenPopover}>{repositoryItem.label}</span>
        </Tooltip>

        <Popover
          anchorEl={popoverAnchorEl}
          open={isPopoverOpen}
          id={popoverId}
          onClose={handleClosePopover}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          {dataSourceContentTable ? (
            <TableView
              table={dataSourceContentTable}
              tableStats={dataSourceContentMetadata}
              selections={selectedItemIds}
              onSelectionsChanged={setSelectedItemIds}
            />
          ) : (
            <LoadingIndicator />
          )}
        </Popover>
      </TableCell>
      <TableCell className={classes.borderless} align="center">
        {[...(repositoryItem.columnNames ?? [])].join(', ')}
      </TableCell>
    </TableRow>
  )
}

export default DataSourceRow
