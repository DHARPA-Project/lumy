import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'

import NotificationsIcon from '@material-ui/icons/Notifications'

import useStyles from './NotificationContainer.styles'

import NotificationSettings from './NotificationSettings'
import NotificationList from './NotificationList'
import { FormattedMessage } from 'react-intl'

export type ChronologicalSortOrder = 'latestFirst' | 'oldestFirst'

const NotificationContainer = (): JSX.Element => {
  const classes = useStyles()

  const [chronologicalSortOrder, setChronologicalSortOrder] = useState<ChronologicalSortOrder>('latestFirst')

  return (
    <Box className={classes.notificationListContainer}>
      <AppBar position="sticky" color="default" variant="elevation" elevation={0}>
        <Toolbar classes={{ regular: classes.notificationToolbar }} variant="dense">
          <Avatar className={classes.avatar}>
            <NotificationsIcon />
          </Avatar>

          <Typography variant="h6" className={classes.title}>
            <FormattedMessage id="panel.notifications.label" />
          </Typography>

          <NotificationSettings sortOrder={chronologicalSortOrder} setSortOrder={setChronologicalSortOrder} />
        </Toolbar>
      </AppBar>

      <NotificationList sortOrder={chronologicalSortOrder} />
    </Box>
  )
}

export default NotificationContainer
