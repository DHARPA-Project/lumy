import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
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
  button: {
    minWidth: 0,
    margin: theme.spacing(0.5),
    padding: 0,
    backgroundColor: 'transparent',
    '& .MuiButton-label': {
      color: theme.palette.text.secondary
    },
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  edit: {
    '&:hover .MuiButton-label': {
      color: theme.palette.info.main
    }
  },
  delete: {
    '&:hover .MuiButton-label': {
      color: theme.palette.error.main
    }
  }
}))
