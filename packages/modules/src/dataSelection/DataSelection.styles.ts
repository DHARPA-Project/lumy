import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  dataSelectionContainer: {
    marginBottom: theme.spacing(2)
  },
  paperWrapper: {
    backgroundColor: 'transparent'
  },
  tableContainer: {
    maxHeight: `calc(100vh - ${theme.spacing(36)}px)`,
    '& caption': {
      captionSide: 'top'
    }
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
