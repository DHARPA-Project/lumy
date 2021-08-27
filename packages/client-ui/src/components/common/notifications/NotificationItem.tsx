import React from 'react'

import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'

import CloseIcon from '@material-ui/icons/Close'

import useStyles from './NotificationItem.styles'
import { INotification } from '../../../state'

type NIProps = {
  notification: INotification
  onCloseClick?: (id: string) => void
}

const NotificationItem = ({ notification, onCloseClick }: NIProps): JSX.Element => {
  const classes = useStyles()

  const date = new Date(notification.date).toLocaleString()

  return (
    <ListItem className={classes.notificationListItem}>
      <Alert
        variant="outlined"
        severity={notification.type}
        classes={{ root: classes.alertRoot, icon: classes.alertIcon }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => onCloseClick(notification.id)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Typography>{notification.message}</Typography>
        <Typography className={classes.notificationDate} variant="body2">
          {date}
        </Typography>
      </Alert>
    </ListItem>
  )
}

export default NotificationItem
