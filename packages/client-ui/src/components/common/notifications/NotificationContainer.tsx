import React, { useContext, useState } from 'react'

import Box from '@material-ui/core/Box'
import Card from '@material-ui/core/Card'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'

import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import useStyles from './NotificationContainer.styles'
import { NotificationContext } from '../../../state'

import NotificationItem from './NotificationItem'

const NotificationContainer = (): JSX.Element => {
  const classes = useStyles()

  const { notifications, deleteNotification, deleteAllNotifications } = useContext(NotificationContext)

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  const handleDeleteAllNotifications = () => {
    /**
     * TODO: Consider prompting user to confirm before deleting all notifications
     */
    deleteAllNotifications()
  }
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

          <IconButton
            className={classes.settingButton}
            onClick={event => setPopoverAnchorEl(event.currentTarget)}
            color="inherit"
            edge="end"
            aria-label="notification-settings"
            aria-haspopup="true"
          >
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        anchorEl={popoverAnchorEl}
        open={!!popoverAnchorEl}
        onClose={() => setPopoverAnchorEl(null)}
        id={!!popoverAnchorEl ? 'notification-setting-list-popover' : null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <List component="ul" aria-label="notification-setting-list" className={classes.settingList}>
          <ListItem
            component="li"
            aria-label="notification-setting"
            button
            onClick={handleDeleteAllNotifications}
            className={classes.settingItem}
          >
            <ListItemIcon>
              <DeleteOutlineIcon />
            </ListItemIcon>
            <ListItemText primary={'Dismiss all'} />
          </ListItem>
        </List>
      </Popover>

      {notifications?.length > 0 ? (
        <List>
          {notifications.map(notification => (
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
    </Box>
  )
}

export default NotificationContainer
