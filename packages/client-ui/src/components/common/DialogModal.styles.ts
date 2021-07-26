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
    padding: 0,
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.error.main}`,
    '&.MuiButton-root': {
      minWidth: 'auto'
    },
    '& .MuiButton-label': {
      color: theme.palette.error.main
    },
    '&:hover': {
      backgroundColor: theme.palette.error.main,
      '& .MuiButton-label': {
        color: theme.palette.common.white
      }
    }
  }
}))
