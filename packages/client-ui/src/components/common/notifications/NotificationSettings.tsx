import React, { useContext, useState } from 'react'

import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import useStyles from './NotificationSettings.styles'
import { NotificationContext } from '../../../state'

const NotificationSettings = (): JSX.Element => {
  const classes = useStyles()

  const { deleteAllNotifications } = useContext(NotificationContext)

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  const handleDeleteAllNotifications = () => {
    /**
     * TODO: Consider prompting user to confirm before deleting all notifications
     */
    deleteAllNotifications()
  }
  return (
    <>
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
    </>
  )
}

export default NotificationSettings
