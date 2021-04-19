import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    width: '100%',
    height: '94vh',
    backgroundColor: theme.palette.background.paper
  },
  tabItem: {
    minWidth: 100,
    flex: 1
  }
}))
