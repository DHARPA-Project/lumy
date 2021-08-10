import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  accordion: {
    borderRight: 'none',
    borderBottom: 'none',
    borderLeft: 'none',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
