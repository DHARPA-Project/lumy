import React from 'react'

import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'

import useStyles from './ColumnSelection.styles'
import { ColumnMap } from './InteractiveTable'
import { FormattedMessage } from 'react-intl'

type ColumnSelectionProps = {
  columns: ColumnMap[]
  toggleColumn: (columnKey: string) => void
}

const ColumnSelection = ({ columns, toggleColumn }: ColumnSelectionProps): JSX.Element => {
  const classes = useStyles()

  return (
    <List
      component="ul"
      aria-labelledby="list-subheader"
      subheader={
        <ListSubheader component="div">
          <FormattedMessage id="interactiveTable.message.chooseVisibleColumns" />
        </ListSubheader>
      }
      className={classes.columnList}
    >
      {columns.map((column, index) => (
        <ListItem onClick={() => toggleColumn(column.key)} button component="li" key={column.key ?? index}>
          <ListItemIcon>
            <Checkbox checked={column.visible} edge="start" tabIndex={-1} />
          </ListItemIcon>
          <ListItemText primary={column.label} />
        </ListItem>
      ))}
    </List>
  )
}

export default ColumnSelection
