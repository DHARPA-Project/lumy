import { makeStyles } from '@material-ui/core/styles'
import '@fontsource/roboto-mono'

const bgIntensity = 800

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[bgIntensity],
    padding: theme.spacing(1, 2),
    fontFamily: 'Roboto Mono',
    fontSize: theme.typography.fontSize * 0.8
  },
  styleDefault: {
    color: theme.palette.getContrastText(theme.palette.grey[bgIntensity])
  },
  styleError: {
    color: theme.palette.error.light
  },
  styleWarn: {
    color: theme.palette.warning.light
  }
}))
