import React, { useContext, useState } from 'react'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import Pagination from '@material-ui/lab/Pagination'

import NotificationsIcon from '@material-ui/icons/Notifications'

import useStyles from './NotificationContainer.styles'
import { NotificationContext } from '../../../state'

import NotificationItem from './NotificationItem'
import NotificationSettings from './NotificationSettings'

const defaultNumberItemsPerPage = 15

const NotificationContainer = (): JSX.Element => {
  const classes = useStyles()

  const [pageNumber, setPageNumber] = useState(1)

  const { notifications, deleteNotification } = useContext(NotificationContext)

  const totalNumberNotifications = notifications?.length ? notifications?.length : 0
  const numberPages = Math.ceil(totalNumberNotifications / defaultNumberItemsPerPage)
  const paginatedNotifications = notifications.slice(
    defaultNumberItemsPerPage * (pageNumber - 1),
    defaultNumberItemsPerPage * pageNumber
  )

  return (
    <Box className={classes.notificationListContainer}>
      <AppBar position="sticky" color="default" variant="elevation" elevation={0}>
        <Toolbar classes={{ regular: classes.notificationToolbar }} variant="dense">
          <Avatar className={classes.avatar}>
            <NotificationsIcon />
          </Avatar>

          <Typography variant="h6" className={classes.title}>
            Notifications
          </Typography>

          <NotificationSettings />
        </Toolbar>
      </AppBar>

      {paginatedNotifications?.length > 0 ? (
        <List>
          {paginatedNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onCloseClick={deleteNotification}
            />
          ))}
        </List>
      ) : (
        <Card className={classes.noNotificationsCard}>
          <Typography variant="subtitle1" component="h3" align="center">
            You have no notifications to view
          </Typography>
        </Card>
      )}

      <AppBar
        position="sticky"
        color="default"
        variant="elevation"
        elevation={0}
        className={classes.bottomBar}
      >
        <Pagination
          size="small"
          shape="rounded"
          count={numberPages}
          page={pageNumber}
          onChange={(event, value) => setPageNumber(value)}
          classes={{ ul: classes.pagination }}
        />
      </AppBar>
    </Box>
  )
}

export default NotificationContainer
