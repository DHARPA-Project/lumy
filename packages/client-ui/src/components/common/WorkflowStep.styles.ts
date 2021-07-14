import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  mainWrapper: {
    height: '100%',
    width: '100%',
    flexShrink: 1,
    padding: theme.layout.pagePadding,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  header: {
    height: theme.layout.pageHeaderHeight,
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
    height: '100%',
    overflow: 'scroll'
  }
}))
