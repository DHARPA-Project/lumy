import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100vh',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflowY: 'hidden',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  }
}))
