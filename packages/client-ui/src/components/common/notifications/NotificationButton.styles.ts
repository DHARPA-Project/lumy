import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  notificationButton: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(0.5),
    zIndex: theme.zIndex.speedDial
  },
  sizeSmall: {
    height: theme.spacing(4),
    width: theme.spacing(4)
  },
  drawerPaper: {
    width: `clamp(${theme.spacing(40)}px, 50vw, ${theme.spacing(100)}px)`,
    border: 'none'
  }
}))
