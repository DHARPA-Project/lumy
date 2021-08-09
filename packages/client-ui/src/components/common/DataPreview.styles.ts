import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  card: {
    padding: theme.spacing(2)
  },
  progress: {
    width: theme.spacing(5),
    height: theme.spacing(5)
  },
  gridItemRoot: {
    display: 'flex',
    justifyContent: 'center'
  }
}))
