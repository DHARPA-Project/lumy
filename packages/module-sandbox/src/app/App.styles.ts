import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  moduleSelector: {
    margin: theme.spacing(1, 2),
    padding: theme.spacing(1, 0),
    '&> *': {
      minWidth: '10rem'
    }
  },
  moduleView: {
    margin: theme.spacing(1, 2),
    flexGrow: 1,
    '&> *': {
      width: '100%'
    }
  }
}))
