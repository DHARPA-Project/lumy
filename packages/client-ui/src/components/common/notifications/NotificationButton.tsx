import React, { useContext, useState } from 'react'

import Fab from '@material-ui/core/Fab'
import Badge from '@material-ui/core/Badge'
import Drawer from '@material-ui/core/Drawer'

import NotificationsIcon from '@material-ui/icons/Notifications'

import useStyles from './NotificationButton.styles'
import { NotificationContext } from '../../../state'
import NotificationContainer from './NotificationContainer'
import { getAppTopLevelElement } from '../../../const/app'

const NotificationButton: React.FC = () => {
  const classes = useStyles()

  const { notifications } = useContext(NotificationContext)

  const [isNotificationContainerOpen, setIsNotificationContainerOpen] = useState(false)

  return (
    <>
      <Fab
        color="default"
        size="small"
        aria-label="edit"
        classes={{
          root: classes.notificationButton,
          sizeSmall: classes.sizeSmall
        }}
        onClick={() => setIsNotificationContainerOpen(true)}
      >
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </Fab>

      <Drawer
        container={getAppTopLevelElement()}
        BackdropProps={{ classes: { root: classes.drawerBackdropRoot } }}
        variant="temporary"
        anchor="left"
        open={isNotificationContainerOpen}
        onClose={() => setIsNotificationContainerOpen(false)}
        classes={{ paper: classes.drawerPaper, root: classes.drawerRoot }}
      >
        <NotificationContainer />
      </Drawer>
    </>
  )
}

export default NotificationButton
