import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  toastItem: {
    margin: theme.spacing(1.5, 0)
  },
  alertRoot: {
    width: '100%',
    padding: theme.spacing(0, 2)
  },
  alertIcon: {
    alignItems: 'center'
  }
}))
