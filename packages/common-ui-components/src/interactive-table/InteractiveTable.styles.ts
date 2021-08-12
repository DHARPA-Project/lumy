import { lighten, makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  dataRegistryPaper: {
    padding: theme.spacing(3)
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    columnGap: theme.spacing(5)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  left: {
    flex: '1 1 100%'
  },
  right: {
    display: 'flex'
  },
  search: {
    width: '100%'
  },
  title: {
    flex: '1 1 100%'
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
  tableHeadCell: {
    borderTop: `1px solid ${theme.palette.divider}`
  },
  tableBody: {
    maxHeight: `calc(100vh - ${theme.spacing(43)}px)`,
    overflow: 'auto'
  },
  pagination: {
    borderTop: `1px solid ${theme.palette.divider}`
  }
}))
