import React from 'react'

import ListItem from '@material-ui/core/ListItem'

import useStyles from './NotificationItem.styles'
import { INotification } from '../../../state'

import NotificationAlert from './NotificationAlert'

type NIProps = {
  notification: INotification
  onCloseClick?: (id: string) => void
}

const NotificationItem = ({ notification, onCloseClick }: NIProps): JSX.Element => {
  const classes = useStyles()

  return (
    <ListItem className={classes.notificationListItem}>
      <NotificationAlert notification={notification} onCloseClick={onCloseClick} variant="outlined" />
    </ListItem>
  )
}

export default NotificationItem
