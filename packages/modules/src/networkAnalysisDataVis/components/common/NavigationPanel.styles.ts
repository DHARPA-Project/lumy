import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  accordion: {
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
