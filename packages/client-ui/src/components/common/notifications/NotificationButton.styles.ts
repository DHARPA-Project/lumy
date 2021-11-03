import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  notificationButton: {
    position: 'fixed',
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
    border: 'none',
    position: 'absolute !important' as 'absolute'
  },
  drawerBackdropRoot: {
    position: 'absolute !important' as 'absolute'
  },
  drawerRoot: {
    position: 'absolute !important' as 'absolute'
  }
}))
