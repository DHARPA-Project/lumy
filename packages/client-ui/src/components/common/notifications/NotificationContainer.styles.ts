import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  notificationListContainer: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column'
  },
  notificationToolbar: {
    minHeight: theme.spacing(6)
  },
  avatar: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    backgroundColor: theme.palette.primary.main
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(1)
  }
}))
