import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  previous: {
    position: 'relative',
    top: theme.spacing(5),
    right: theme.spacing(-1.5)
  },
  next: {
    position: 'relative',
    bottom: theme.spacing(5),
    right: theme.spacing(-1.5)
  },
  indicators: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepIndicator: {
    position: 'relative',
    display: 'inline-block',
    height: theme.spacing(5),
    width: theme.spacing(1),
    margin: '0 .1em',
    padding: 0,
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: '.5em',
    backgroundColor: 'transparent',
    zIndex: 5,
    overflow: 'hidden',
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&:not(:last-child)': {
      marginBottom: theme.spacing(3)
    },
    '&.active': {
      borderColor: theme.palette.secondary.main
    },
    '&.completed': {
      backgroundColor: theme.palette.primary.main
    }
  }
}))
