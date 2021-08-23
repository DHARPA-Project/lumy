import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles<Theme>(theme => ({
  mainWrapper: {
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.layout.pagePadding,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  header: {
    height: theme.layout.pageHeaderHeight,
    width: '100%',
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
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'scroll'
  }
}))
