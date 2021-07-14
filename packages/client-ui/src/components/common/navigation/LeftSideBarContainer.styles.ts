import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  sideBarContainer: {
    position: 'fixed',
    height: '100vh',
    width: theme.layout.sideBarFullWidth,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.collapsed': {
      width: theme.layout.sideBarCollapsedWidth
    }
  }
}))
