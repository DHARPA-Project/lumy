import React, { useContext, useState } from 'react'

import { FormattedMessage } from 'react-intl'
import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import useStyles from './NotificationSettings.styles'
import { NotificationContext } from '../../../state'
import { ChronologicalSortOrder } from './NotificationContainer'

interface NSProps {
  sortOrder: ChronologicalSortOrder
  setSortOrder: React.Dispatch<React.SetStateAction<ChronologicalSortOrder>>
}

const NotificationSettings = ({ sortOrder, setSortOrder }: NSProps): JSX.Element => {
  const classes = useStyles()

  const { deleteAllNotifications } = useContext(NotificationContext)

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

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
        <List
          component="ul"
          aria-label="notification-setting-list"
          className={classes.settingList}
          subheader={
            <ListSubheader component="div">
              <FormattedMessage id="panel.notifications.settings.label" />
            </ListSubheader>
          }
        >
          <ListItem
            component="li"
            aria-label="chronological notification sort order"
            className={classes.settingItem}
          >
            <TextField
              select
              name="method"
              label="Sort Order"
              value={sortOrder}
              onChange={event => setSortOrder(event.target.value as ChronologicalSortOrder)}
              SelectProps={{ native: true }}
              variant="outlined"
            >
              <FormattedMessage id="panel.notifications.settings.sortOrder.latest">
                {msg => <option value={'latestFirst'}>{msg}</option>}
              </FormattedMessage>
              <FormattedMessage id="panel.notifications.settings.sortOrder.oldest">
                {msg => <option value={'oldestFirst'}>{msg}</option>}
              </FormattedMessage>
            </TextField>
          </ListItem>

          <ListItem
            component="li"
            aria-label="delete-notifications"
            button
            onClick={deleteAllNotifications}
            className={classes.settingItem}
          >
            <ListItemIcon>
              <DeleteOutlineIcon />
            </ListItemIcon>
            <ListItemText
              primary={<FormattedMessage id="panel.notifications.settings.dismissButton.label" />}
            />
          </ListItem>
        </List>
      </Popover>
    </>
  )
}

export default NotificationSettings
