import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  noNotificationsCard: {
    padding: theme.spacing(2)
  },
  bottomBar: {
    bottom: 0,
    marginTop: 'auto'
  },
  pagination: {
    justifyContent: 'center'
  }
}))
