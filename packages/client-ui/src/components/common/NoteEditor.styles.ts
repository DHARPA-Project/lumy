import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  noteEditor: {
    backgroundColor: theme.palette.background.paper
  },
  newNoteButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}))
