import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  errorIcon: {
    color: theme.palette.error.light
  },
  dialog: {
    minHeight: theme.spacing(10),
    padding: theme.spacing(3, 1)
  },
  dialogLogPanel: {
    maxHeight: theme.spacing(30),
    overflowY: 'scroll',
    overflowX: 'hidden',
    margin: theme.spacing(2, 0)
  },
  dialogSectionFullWidth: {
    width: '100%'
  },
  dialogLogListGutters: {
    paddingLeft: 0,
    paddingRight: 0
  }
}))
