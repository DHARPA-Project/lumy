import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  headline: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(2),
    textAlign: 'center'
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    height: 320
  }
}))
