import { makeStyles } from '@material-ui/core/styles'
import '@fontsource/roboto-mono'

const bgIntensity = 800

export default makeStyles(theme => ({
  logContainer: {
    overflowY: 'scroll',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey[bgIntensity],
    padding: theme.spacing(1, 2),
    fontFamily: 'Roboto Mono',
    fontSize: theme.typography.fontSize * 0.8,
    '& p': {
      overflowWrap: 'anywhere'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
      },
      '&:active': {
        backgroundColor: 'rgba(255, 255, 255 ,0.9)'
      }
    }
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
