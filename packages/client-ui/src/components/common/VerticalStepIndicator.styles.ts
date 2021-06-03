import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  stepBarContainer: {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    padding: theme.spacing(2, 0),
    borderRight: `1px solid ${theme.palette.divider}`
  },
  stepBarContent: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 0.5)
  },
  workflowNavArrow: {
    cursor: 'pointer',
    fontSize: '1.5rem',
    '&.disabled': {
      color: theme.palette.text.disabled,
      opacity: theme.palette.action.disabledOpacity,
      pointerEvents: 'none'
    }
  },
  previous: {
    position: 'relative'
  },
  next: {
    position: 'relative',
    transform: 'rotate(180deg)'
  },
  indicators: {
    position: 'relative',
    margin: theme.spacing(3, 0),
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    '&:after': {
      content: `''`,
      position: 'absolute',
      top: activeStep => `calc(${activeStep} * ${theme.spacing(7)}px)`,
      height: `calc(${theme.spacing(4)}px + 4 * 1px)`,
      width: `calc(${theme.spacing(0.75)}px + 4 * 1px)`,
      marginTop: `calc(${theme.spacing(1.5)}px - 2px)`,
      marginBottom: `calc(${theme.spacing(1.5)}px - 2px)`,
      padding: '1px',
      backgroundColor: 'transparent',
      border: `1px dotted ${theme.palette.primary.main}`,
      borderRadius: '.5em',
      zIndex: 1,
      transition: 'top 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  stepIndicator: {
    position: 'relative',
    display: 'inline-block',
    height: theme.spacing(4),
    width: theme.spacing(0.75),
    margin: theme.spacing(1.5, 0),
    padding: 0,
    border: 'none',
    borderRadius: '.5em',
    backgroundColor: theme.palette.action.disabled,
    zIndex: 2,
    overflow: 'hidden',
    transition: theme.transitions.create('all', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.completed': {
      backgroundColor: theme.palette.primary.light
    }
  }
}))
