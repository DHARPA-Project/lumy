import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  tableContainer: {
    maxHeight: `calc(100vh - ${theme.spacing(36)}px)`
  },
  table: {
    minWidth: theme.spacing(100),
    '& thead th': {
      fontWeight: '600',
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default
    },
    '& tbody td': {
      fontWeight: '300'
    }
  },
  tableBody: {
    maxHeight: `calc(100vh - ${theme.spacing(43)}px)`,
    overflowY: 'auto'
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}))
