import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  toastContainer: {
    boxSizing: 'border-box',
    position: 'fixed',
    zIndex: theme.zIndex.snackbar,
    width: theme.spacing(70),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(40)
    },
    '&.top-right': {
      top: theme.spacing(4),
      right: theme.spacing(4)
    },
    '&.bottom-right': {
      bottom: theme.spacing(4),
      right: theme.spacing(4)
    },
    '&.top-left': {
      top: theme.spacing(4),
      left: theme.spacing(4)
    },
    '&.bottom-left': {
      bottom: theme.spacing(4),
      left: theme.spacing(4)
    }
  }
}))
