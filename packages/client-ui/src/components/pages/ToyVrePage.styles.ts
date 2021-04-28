import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100vh',
    marginTop: -theme.spacing(3),
    marginBottom: -theme.spacing(3),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    // height: `calc(100vh - ${theme.spacing(3) * 2}px)`,
    overflowY: 'hidden',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
    justifyContent: 'space-between',
    flexWrap: 'nowrap'
  }
}))
