import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  success: {
    color: theme.palette.success.main
  },
  info: {
    color: theme.palette.info.main
  },
  warning: {
    color: theme.palette.warning.main
  },
  error: {
    color: theme.palette.error.main
  }
}))
