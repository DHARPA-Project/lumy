import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  row: {
    '&:nth-of-type(4n+1), &:nth-of-type(4n+2)': {
      backgroundColor: theme.palette.action.hover
    }
  },
  cellContainer: {
    display: 'flex'
  },
  checkbox: {
    marginRight: theme.spacing(2)
  },
  formControl: {
    minWidth: theme.spacing(15),
    '&:not(:last-child)': {
      marginRight: theme.spacing(2)
    }
  },
  errorCell: {
    paddingTop: 0
  },
  errorMessage: {
    color: theme.palette.error.main,
    textAlign: 'center'
  },
  borderless: {
    border: 'none',
    paddingBottom: 0
  }
}))
