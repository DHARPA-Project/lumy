import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  dialogWrapper: {
    padding: theme.spacing(5)
  },
  dialogTitle: {
    textAlign: 'center',
    color: theme.palette.primary.main
  },
  closeButtonRoot: {
    position: 'absolute',
    top: theme.spacing(3),
    right: theme.spacing(3),
    minWidth: 'auto',
    padding: 0,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.error.main}`,
    '& $closeButtonLabel': {
      color: theme.palette.error.main
    },
    '&:hover': {
      backgroundColor: theme.palette.error.main,
      '& $closeButtonLabel': {
        color: theme.palette.common.white
      }
    }
  },
  closeButtonLabel: {
    color: theme.palette.secondary.dark
  }
}))
