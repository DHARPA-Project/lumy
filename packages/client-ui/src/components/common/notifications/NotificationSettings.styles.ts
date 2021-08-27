import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  settingButton: {
    padding: theme.spacing(0.75)
  },
  settingList: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  settingItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))
