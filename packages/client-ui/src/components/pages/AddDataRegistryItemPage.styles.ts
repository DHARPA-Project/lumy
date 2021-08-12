import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: theme.breakpoints.width('sm'),
    margin: '0 auto',
    padding: theme.spacing(2, 1)
  },
  textField: {
    width: '100%'
  },
  linkButton: {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}))
