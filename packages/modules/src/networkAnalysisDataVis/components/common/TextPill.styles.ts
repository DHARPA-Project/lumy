import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  pillContainer: {
    height: theme.spacing(2),
    margin: theme.spacing(0, 1),
    padding: theme.spacing(0, 1),
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[800],
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover $pillContent': {
      width: 'auto'
    }
  },
  pillContent: {
    width: 0,
    overflow: 'hidden'
  }
}))
