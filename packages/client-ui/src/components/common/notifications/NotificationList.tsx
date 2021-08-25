import React, { useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import AlarmIcon from '@material-ui/icons/Alarm'

import { NotificationContext } from '../../../state'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

const NotificationList = (): JSX.Element => {
  const classes = useStyles()

  const { notifications } = useContext(NotificationContext)

  return (
    <List className={classes.root}>
      {notifications.map(notification => (
        <ListItem key={notification.id}>
          <ListItemIcon>
            <Avatar>
              <AlarmIcon color="primary" />
            </Avatar>
          </ListItemIcon>
          <ListItemText primary={notification.message} secondary={notification.message} />
        </ListItem>
      ))}
    </List>
  )
}

export default NotificationList
