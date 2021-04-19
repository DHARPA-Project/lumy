import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  dialogWrapper: {
    padding: theme.spacing(5)
  },
  dialogTitle: {
    textAlign: 'center',
    color: theme.palette.primary.main
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: theme.palette.secondary.light,
    '&.MuiButton-root': {
      minWidth: 'auto'
    },
    '& .MuiButton-label': {
      color: theme.palette.secondary.dark
    }
  }
}))
