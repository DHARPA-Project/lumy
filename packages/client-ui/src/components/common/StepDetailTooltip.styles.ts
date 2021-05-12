import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  tooltip: {
    minWidth: theme.spacing(30),
    maxWidth: theme.spacing(60),
    fontSize: theme.typography.pxToRem(12)
  }
}))
