import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100vh',
    width: theme.layout.toolBarWidth,
    position: 'fixed',
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    zIndex: theme.zIndex.appBar,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.collapsed': {
      width: 0
    }
  },
  sideBarToggleButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(1)
  },
  sideBarExpandArrow: {
    fontSize: '1rem',
    transform: 'rotate(180deg)',
    transition: 'transform 0.3s ease',
    '&.inward': {
      transform: 'rotate(0deg)'
    }
  }
}))
