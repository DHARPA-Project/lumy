import { makeStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

const getLinearGradientBreakpoints = (color: string, breakpoints = [0, 0.8, 1.0]) =>
  breakpoints.map(o => fade(color, o))

export default makeStyles(theme => ({
  noteItem: {
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.divider}`
  },
  noteContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1, 0)
    }
  },
  noteItemContainer: {
    minHeight: theme.breakpoints.width('sm') / 9,
    maxHeight: theme.breakpoints.width('sm') / 6,
    overflowY: 'hidden',
    position: 'relative'
  },
  noteTitle: {
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightBold
  },
  fadeOverlay: {
    background: `linear-gradient(${getLinearGradientBreakpoints(theme.palette.background.paper).join(', ')})`,
    position: 'absolute',
    left: 0,
    right: 0,
    height: '50%',
    bottom: 0
  },
  buttonItem: {
    textDecoration: 'none',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  timestamp: {
    alignSelf: 'flex-end'
  }
}))
