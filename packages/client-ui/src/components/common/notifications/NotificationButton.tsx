import React, { useContext, useState } from 'react'

import Fab from '@material-ui/core/Fab'
import Badge from '@material-ui/core/Badge'
import Drawer from '@material-ui/core/Drawer'

import NotificationsIcon from '@material-ui/icons/Notifications'

import useStyles from './NotificationButton.styles'
import { NotificationContext } from '../../../state'
import NotificationList from './NotificationList'

const NotificationButton: React.FC = () => {
  const classes = useStyles()

  const { notifications } = useContext(NotificationContext)

  const [isNotificationListOpen, setIsNotificationListOpen] = useState(false)

  return (
    <>
      <Drawer
        variant="temporary"
        anchor="right"
        open={isNotificationListOpen}
        onClose={() => setIsNotificationListOpen(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <NotificationList />
      </Drawer>

      {!isNotificationListOpen && (
        <Fab
          color="default"
          size="small"
          aria-label="edit"
          classes={{
            root: classes.notificationButton,
            sizeSmall: classes.sizeSmall
          }}
          onClick={() => {
            console.log('notification button clicked!')
            setIsNotificationListOpen(true)
          }}
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </Fab>
      )}
    </>
  )
}

export default NotificationButton
