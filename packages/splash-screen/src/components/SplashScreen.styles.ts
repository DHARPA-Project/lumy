import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    background: `linear-gradient(45deg, #e6e6e6 30%, #d2d2d2 60%)`
  },
  container: {
    height: '100vh',
    margin: '0 auto',
    maxWidth: theme.breakpoints.width('sm')
  },
  header: {
    fontSize: theme.typography.fontSize * 2,
    textAlign: 'center'
  },
  spinnerContainer: {
    textAlign: 'center',
    marginTop: theme.spacing(2)
  },
  logContainerWrapper: {
    flex: '0 0 auto',
    overflowY: 'hidden'
  },
  logContainer: {
    overflowY: 'scroll',
    maxHeight: '20vh'
  },
  accordion: {
    boxShadow: 'none',
    backgroundColor: 'inherit',
    '& .MuiAccordionDetails-root': {
      padding: 0
    },
    '& .MuiAccordionSummary-root': {
      padding: 0
    }
  }
}))
