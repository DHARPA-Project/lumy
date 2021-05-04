import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import AlarmIcon from '@material-ui/icons/Alarm'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

const notificationList = [
  {
    id: 1,
    title: "You've missed an important notification!",
    icon: <AlarmIcon color="primary" />,
    subTitle: new Date().toLocaleString() // current time
  },
  {
    id: 2,
    title: 'Text processing complete',
    icon: <CheckCircleOutlineIcon style={{ color: green[500] }} />,
    subTitle: new Date(Date.now() - 30 * 60 * 1000).toLocaleString() // time 30 min ago
  },
  {
    id: 3,
    title: 'ERROR: Invalid data format!',
    icon: <ErrorOutlineIcon color="error" />,
    subTitle: new Date(Date.now() - 60 * 60 * 1000).toLocaleString() // time one hour ago
  }
]

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper
  }
}))

const NotificationList = (): JSX.Element => {
  const classes = useStyles()

  return (
    <List className={classes.root}>
      {notificationList.map(item => (
        <ListItem key={item.id}>
          <ListItemIcon>
            <Avatar>{item.icon}</Avatar>
          </ListItemIcon>
          <ListItemText primary={item.title} secondary={item.subTitle} />
        </ListItem>
      ))}
    </List>
  )
}

export default NotificationList
