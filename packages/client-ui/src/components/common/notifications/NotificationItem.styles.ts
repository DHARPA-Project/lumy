import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  itemContainer: {
    '&:nth-of-type(even) $itemRoot': {
      backgroundColor: theme.palette.grey[50]
    }
  },
  itemRoot: {},
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
  },
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
