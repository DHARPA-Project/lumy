import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {},
  accordion: {
    border: '1px solid',
    borderColor: theme.palette.divider,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    }
  },
  expandedAccordion: {
    margin: '0 !important'
  }
}))
