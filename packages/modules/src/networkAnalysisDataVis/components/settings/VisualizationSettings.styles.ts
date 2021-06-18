import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  header: {
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  popoverButton: {
    marginRight: -theme.spacing(1)
  },
  settingCardContent: {
    padding: 0,
    '&:last-child': {
      padding: 0
    }
  }
}))
