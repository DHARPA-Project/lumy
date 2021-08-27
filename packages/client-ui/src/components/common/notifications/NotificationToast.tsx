import React, { useContext, useEffect, useRef } from 'react'

import Slide from '@material-ui/core/Slide'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Alert from '@material-ui/lab/Alert'

import CloseIcon from '@material-ui/icons/Close'

import useStyles from './NotificationToast.styles'
import { NotificationContext, INotification } from '../../../state'

type NTProps = {
  notification: INotification
  lifeSpan?: number
  slideDirection: 'left' | 'right' | 'up' | 'down'
}

const NotificationToast = ({ notification, lifeSpan = 5000, slideDirection }: NTProps): JSX.Element => {
  const classes = useStyles()

  const timeoutRef = useRef(null)

  const { hideNotification } = useContext(NotificationContext)

  useEffect(() => {
    if (lifeSpan != null && notification.visible) {
      timeoutRef.current = setTimeout(() => {
        hideNotification(notification.id)
      }, lifeSpan)

      return () => clearTimeout(timeoutRef.current)
    }
  }, [notification.id, notification.visible, lifeSpan])

  return (
    <Slide direction={slideDirection} in={notification.visible} mountOnEnter unmountOnExit>
      <ListItem className={classes.toastItem}>
        <Alert
          variant="filled"
          severity={notification.type}
          classes={{ root: classes.alertRoot, icon: classes.alertIcon }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => hideNotification(notification.id)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <Typography>{notification.message}</Typography>
        </Alert>
      </ListItem>
    </Slide>
  )
}

export default NotificationToast
