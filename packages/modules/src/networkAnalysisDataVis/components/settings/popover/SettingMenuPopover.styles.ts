import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  popover: {
    position: 'relative'
  },
  list: {
    width: 'auto',
    minWidth: 260,
    backgroundColor: theme.palette.background.paper
  }
}))
