import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  dataRegistryContainer: {
    height: '100vh',
    display: 'grid',
    alignItems: 'center'
  },
  dataRegistryContent: {
    padding: theme.spacing(3)
  },
  headline: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    textAlign: 'center'
  },
  toolbar: {
    width: '100%',
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between'
  },
  search: {
    width: '75%'
  },
  addItemButton: {
    margin: 0
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
  }
}))
