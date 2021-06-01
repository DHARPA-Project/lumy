import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  workflowContainer: {
    minHeight: '100vh',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: `fit-content(5%) auto`
  },
  stepContainer: {
    height: '100vh',
    maxWidth: '100%',
    position: 'relative',
    marginLeft: 0,
    padding: 0,
    display: 'flex',
    overflow: 'hidden'
  },
  toolAreaToggle: {
    position: 'absolute',
    '&.MuiFab-root': {
      bottom: theme.spacing(2),
      right: theme.spacing(1)
    },
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(1)
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(1)
    }
  },
  mainPane: {
    flex: 1,
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  },
  additionalPane: {
    flex: 1,
    overflow: 'hidden'
  },
  verticalPaneDivider: {
    border: `1px solid ${theme.palette.divider}`,
    cursor: 'col-resize'
  }
}))
