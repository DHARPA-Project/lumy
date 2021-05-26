import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  row: {
    '&:nth-of-type(4n+3), &:nth-of-type(4n+4)': {
      backgroundColor: theme.palette.background.default
    }
  },
  cellContainer: {
    display: 'flex'
  },
  checkbox: {
    marginRight: theme.spacing(2)
  },
  selectContainer: {
    width: '100%',
    flexGrow: 1
  },
  formControl: {
    minWidth: theme.spacing(10),
    margin: theme.spacing(1)
  },
  errorCell: {
    padding: 0
  },
  errorMessage: {
    color: theme.palette.error.main,
    textAlign: 'center'
  },
  tableCell: {
    border: 'none',
    padding: theme.spacing(0.5, 1)
  }
}))
