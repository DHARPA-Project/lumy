import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {},
  titleField: {
    flexGrow: 1,
    justifyContent: 'center',
    '& :before': {
      borderBottom: 'none',
      transition: 'none'
    },
    '& :hover:before': {
      borderBottom: 'none !important'
    },
    '& :after': {
      transition: 'none',
      borderBottom: 'none',
      transform: 'scaleX(0)'
    },
    '& input': {
      fontSize: theme.typography.h6.fontSize
    }
  },
  noteActionButtonsContainer: {
    marginTop: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  }
}))
