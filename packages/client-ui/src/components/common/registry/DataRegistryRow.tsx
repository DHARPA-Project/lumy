import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { RowLike } from 'apache-arrow/type'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Popover from '@material-ui/core/Popover'
import Button from '@material-ui/core/Button'

import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import {
  useDataRepositoryItemCreator,
  useDataRepositoryItemValue,
  DataRepositoryItemStructure
} from '@dharpa-vre/client-core'
import { LoadingIndicator, TableView } from '@dharpa-vre/client-ui'

import useStyles from './DataRegistryRow.styles'

// type RepositoryItemId = DataRepositoryItemStructure['id']['TValue']

type DataRegistryRowProps = {
  repositoryItem: RowLike<DataRepositoryItemStructure>
}

const DataRegistryRow = ({ repositoryItem }: DataRegistryRowProps): JSX.Element => {
  const classes = useStyles()
  const history = useHistory()

  // const [status, errorMessage, addItem, updateItem, removeItem] = useDataRepositoryItemCreator(sessionId)
  const [
    dataSourceContentTablePreview,
    dataSourceContentMetadata
  ] = useDataRepositoryItemValue(repositoryItem.id, { pageSize: 5}) // prettier-ignore

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

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
          {dataSourceContentTablePreview ? (
            <TableView table={dataSourceContentTablePreview} tableStats={dataSourceContentMetadata} />
          ) : (
            <LoadingIndicator />
          )}
        </Popover>
      </TableCell>

      <TableCell className={classes.borderless} align="center">
        {repositoryItem.type}
      </TableCell>

      <TableCell className={classes.borderless} align="center">
        {repositoryItem.tags}
      </TableCell>

      <TableCell className={classes.borderless} align="center">
        {repositoryItem.notes}
      </TableCell>

      <TableCell className={classes.borderless} align="center">
        <Button
          className={classes.button + ' ' + classes.edit}
          onClick={() => {
            console.log(`editing ${repositoryItem.label}`)
            history.push(`/dataregistry/edit/${repositoryItem.id}`)
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </Button>

        <Button
          className={classes.button + ' ' + classes.delete}
          onClick={() => {
            console.log(`deleting ${repositoryItem.label}`)
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default DataRegistryRow
