import React from 'react'

import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'

import CloseIcon from '@material-ui/icons/Close'

import useStyles from './NotificationAlert.styles'
import { INotification } from '../../../state'

type NAProps = {
  notification: INotification
  onCloseClick?: (id: string) => void
}

const NotificationAlert = React.forwardRef(
  (props: NAProps, ref): JSX.Element => {
    const classes = useStyles()

    const { notification, onCloseClick } = props ?? {}

    return (
      <Alert
        ref={ref}
        severity={notification.type}
        classes={{ root: classes.alertRoot, icon: classes.alertIcon }}
        action={
          onCloseClick ? (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => onCloseClick(notification.id)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          ) : null
        }
      >
        <Typography>{notification.message}</Typography>
      </Alert>
    )
  }
)

export default NotificationAlert
