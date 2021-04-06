import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: 0,
    color: theme.palette.text.secondary,
    overflow: 'hidden',
    opacity: 1,
    textTransform: 'uppercase',
    '&.invisible': {
      width: 0,
      opacity: 0
    }
  }
}))
