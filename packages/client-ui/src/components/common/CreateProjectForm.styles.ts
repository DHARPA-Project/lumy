import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  newProjectForm: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiFormControl-root': {
      width: '100%',
      minWidth: theme.spacing(50),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  },
  modalSubmitButton: {
    margin: `${theme.spacing(3)}px auto ${theme.spacing(3)}px`
  }
}))
