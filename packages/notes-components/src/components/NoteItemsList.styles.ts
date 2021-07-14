import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  noteList: {
    '& .MuiListItem-root': {
      margin: theme.spacing(1, 0),
      '&:first-child': {
        marginTop: 0
      },
      '&:last-child': {
        marginBottom: 0
      }
    }
  },
  card: {
    padding: theme.spacing(2)
  }
}))
