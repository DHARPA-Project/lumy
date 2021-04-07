import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: 0,
    color: theme.palette.text.hint,
    overflow: 'hidden',
    fontWeight: 300,
    letterSpacing: 1,
    textTransform: 'uppercase'
  }
}))
