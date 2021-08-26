import React, { useContext, useEffect, useRef } from 'react'

import Slide from '@material-ui/core/Slide'
import ListItem from '@material-ui/core/ListItem'

import useStyles from './NotificationToast.styles'
import { NotificationContext, INotification } from '../../../state'

import NotificationAlert from './NotificationAlert'

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
        <NotificationAlert notification={notification} onCloseClick={hideNotification} variant="filled" />
      </ListItem>
    </Slide>
  )
}

export default NotificationToast
