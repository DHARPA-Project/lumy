import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    '& .MuiListItem-root': {
      margin: theme.spacing(1, 0),
      '&:first-child': {
        marginTop: 0
      },
      '&:last-child': {
        marginBottom: 0
      }
    }
  }
}))
