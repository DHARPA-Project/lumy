import React, { useContext } from 'react'

import List from '@material-ui/core/List'

import useStyles from './ToastContainer.styles'
import { NotificationContext } from '../../../state'

import NotificationToast from './NotificationToast'

type TCProps = {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left'
}

const ToastContainer = ({ position = 'bottom-left' }: TCProps): JSX.Element => {
  const classes = useStyles()

  const { notifications } = useContext(NotificationContext)

  const slideDirection = position.includes('left') ? 'right' : 'left'

  return (
    <List component="ul" className={classes.toastContainer + ' ' + position}>
      {notifications.map(notification => (
        <NotificationToast
          notification={notification}
          key={notification.id}
          slideDirection={slideDirection}
        />
      ))}
    </List>
  )
}

export default ToastContainer
