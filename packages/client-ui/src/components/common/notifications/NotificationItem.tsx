import React from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'

import DeleteIcon from '@material-ui/icons/Delete'

import useStyles from './NotificationItem.styles'
import { INotification } from '../../../state'

import NotificationIcon from './NotificationIcon'

type NIProps = {
  notification: INotification
  onCloseClick?: (id: string) => void
}

const NotificationItem = ({ notification, onCloseClick }: NIProps): JSX.Element => {
  const classes = useStyles()

  const { id, message, date, type } = notification ?? {}
  const formattedDate = new Date(date).toLocaleString()

  return (
    <ListItem classes={{ container: classes.itemContainer, root: classes.itemRoot }}>
      <ListItemIcon>
        <NotificationIcon type={type} />
      </ListItemIcon>
      <ListItemText primary={message} secondary={formattedDate} />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => onCloseClick(id)}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default NotificationItem
