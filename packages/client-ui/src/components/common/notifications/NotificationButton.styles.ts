import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  notificationButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.speedDial
  },
  sizeSmall: {
    height: theme.spacing(4),
    width: theme.spacing(4)
  },
  drawerPaper: {
    width: '50%',
    maxWidth: theme.spacing(100),
    [theme.breakpoints.down('sm')]: {
      minWidth: theme.spacing(40)
    }
  }
}))
