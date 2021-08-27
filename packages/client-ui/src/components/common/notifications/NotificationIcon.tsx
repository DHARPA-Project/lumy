import React from 'react'

import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined'
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined'
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined'

import useStyles from './NotificationIcon.styles'
import { NotificationCategory } from '../../../state'

const NotificationIcon = ({ type }: { type: NotificationCategory }): JSX.Element => {
  const classes = useStyles()

  switch (type) {
    case 'success':
      return <CheckCircleOutlineIcon className={classes.success} />
    case 'info':
      return <InfoOutlinedIcon className={classes.info} />
    case 'warning':
      return <ReportProblemOutlinedIcon className={classes.warning} />
    case 'error':
      return <ErrorOutlineOutlinedIcon className={classes.error} />
    default:
      return <NotificationsOutlinedIcon className={classes.error} />
  }
}

export default NotificationIcon
