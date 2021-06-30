import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  row: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.grey[50]
    },
    '&:last-of-type td': {
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  },
  borderless: {
    border: 'none'
  },
  checkbox: {
    marginRight: theme.spacing(2),
    padding: theme.spacing(0.5)
  }
}))
