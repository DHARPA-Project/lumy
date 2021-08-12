import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles<Theme>(theme => ({
  sideBarTop: {
    height: theme.layout.navBarTop,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2)
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    fontWeight: 700
  },
  sideBarToggleButton: {
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(0.5),
    transition: theme.transitions.create('right', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.aside': {
      right: theme.spacing(-2)
    }
  },
  sideBarExpandArrow: {
    fontSize: '1rem',
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.inward': {
      transform: 'rotate(180deg)'
    }
  },
  navList: {
    flexGrow: 1,
    overflow: 'hidden'
  },
  sideBarBottom: {
    height: theme.spacing(8),
    padding: theme.spacing(2, 1),
    justifySelf: 'flex-end',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}))
