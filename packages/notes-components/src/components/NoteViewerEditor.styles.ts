import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {},
  titleField: {
    flexGrow: 1,
    justifyContent: 'center',
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
      transition: 'none'
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: 'none'
    },
    '& .MuiInput-underline.Mui-focused:after': {
      transition: 'none',
      borderBottom: 'none',
      transform: 'scaleX(0)'
    },
    '& input': {
      fontSize: theme.typography.fontSize * 2
    }
  },
  noteActionButtonsContainer: {
    marginTop: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  }
}))
