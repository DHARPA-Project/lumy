import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  paperWrapper: {
    backgroundColor: 'transparent'
  },
  tableContainer: {
    maxHeight: `calc(100vh - ${theme.spacing(36)}px)`
  },
  table: {
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.grey[100]
    },
    '& tbody td': {
      fontWeight: '300'
    }
  },
  tableBody: {
    maxHeight: `calc(100vh - ${theme.spacing(43)}px)`,
    overflow: 'auto'
  },
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
