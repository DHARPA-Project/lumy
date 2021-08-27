import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  notificationListItem: {
    margin: theme.spacing(1.5, 0)
  },
  alertRoot: {
    width: '100%',
    padding: theme.spacing(0, 2)
  },
  alertIcon: {
    alignItems: 'center'
  },
  notificationDate: {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.caption.fontSize
  }
}))
