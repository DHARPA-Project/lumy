import React, { useState } from 'react'

import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import Popover from '@material-ui/core/Popover'
import IconButton from '@material-ui/core/IconButton'
import Checkbox from '@material-ui/core/Checkbox'

import VisibilityIcon from '@material-ui/icons/Visibility'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'

import useStyles from './TableRow.styles'
import { ColumnMap } from './InteractiveTable'

type InteractiveTableRowProps = {
  item: Record<string, string>
  columns: ColumnMap[]
  isSelected: boolean
  onSelectionChange: () => void
  onEditItemClick?: (itemId: string) => void
  contentPreview?: JSX.Element
}

const InteractiveTableRow = ({
  item,
  columns,
  isSelected,
  onSelectionChange,
  onEditItemClick,
  contentPreview
}: InteractiveTableRowProps): JSX.Element => {
  const classes = useStyles()

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <TableRow className={classes.row} classes={{ selected: classes.selected }} selected={isSelected}>
      <TableCell padding="checkbox" className={classes.borderless}>
        <Checkbox
          checked={isSelected}
          onChange={onSelectionChange}
          inputProps={{ 'aria-labelledby': item.id }}
        />
      </TableCell>

      {columns.map((column, index) => (
        <TableCell className={classes.borderless} align="center" key={column.key ?? index}>
          {column?.key ? item[column?.key] : ''}
        </TableCell>
      ))}

      {(contentPreview || onEditItemClick) && (
        <TableCell
          className={classes.borderless + ' ' + classes.condensed}
          align="center"
          padding="none"
          size="small"
        >
          {contentPreview && (
            <Tooltip arrow title="click to open content preview">
              <IconButton
                className={classes.button}
                onClick={event => setPopoverAnchorEl(event.currentTarget)}
              >
                <VisibilityIcon classes={{ root: classes.previewIcon }} />
              </IconButton>
            </Tooltip>
          )}

          {onEditItemClick && (
            <Tooltip arrow title={`edit item ${item.id}`}>
              <IconButton className={classes.button} onClick={() => onEditItemClick(item.id)}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      )}

      <Popover
        anchorEl={popoverAnchorEl}
        open={!!popoverAnchorEl}
        id={!!popoverAnchorEl ? 'data-table-content-preview-popover' : null}
        onClose={() => setPopoverAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        {contentPreview}
      </Popover>
    </TableRow>
  )
}

export default InteractiveTableRow
