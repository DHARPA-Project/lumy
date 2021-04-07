import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    position: 'fixed',
    height: '100vh',
    width: theme.layout.sideBarFullWidth,
    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    borderRight: `1px solid ${theme.palette.divider}`,
    '&.collapsed': {
      width: theme.layout.sideBarCollapsedWidth
    }
  },
  sideBarTop: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(12)
  },
  logo: {
    textTransform: 'uppercase'
  },
  sideBarToggleButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: '-14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '50%',
    border: '1px solid ' + theme.palette.divider,
    backgroundColor: theme.palette.background.default,
    cursor: 'pointer',
    zIndex: 10,
    '&:hover': {
      color: theme.palette.background.default,
      backgroundColor: theme.palette.text.primary
    }
  },
  sideBarExpandArrow: {
    fontSize: '1rem',
    transition: 'transform 0.3s ease',
    transform: 'rotate(0deg)',
    '&.inward': {
      transform: 'rotate(180deg)'
    }
  },
  sideBarBottom: {
    marginTop: 'auto',
    paddingBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))
