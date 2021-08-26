import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  notificationListContainer: {
    position: 'relative',
    width: '100%'
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
  },
  settingButton: {
    padding: theme.spacing(0.75)
  },
  settingList: {
    margin: theme.spacing(2, 0)
  },
  settingItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  noNotificationsCard: {
    padding: theme.spacing(2)
  }
}))
