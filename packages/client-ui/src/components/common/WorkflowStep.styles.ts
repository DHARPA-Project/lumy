import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  mainWrapper: {
    height: '100%',
    width: '100%',
    flexShrink: 1,
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  header: {
    padding: theme.spacing(1, 0)
  },
  headline: {
    margin: 0,
    marginBottom: theme.spacing(1)
  },
  breadcrumbs: {
    marginBottom: theme.spacing(1)
  },
  mainContent: {
    height: `calc(100% - ${theme.spacing(12)}px)`,
    overflow: 'scroll'
  }
}))
