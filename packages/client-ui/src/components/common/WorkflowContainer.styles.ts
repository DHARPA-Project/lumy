import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  workflowContainer: {
    minHeight: '100vh',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: `fit-content(5%) auto`,
    userSelect: 'none',
    touchCallout: 'none'
  },
  stepContainer: {
    height: '100vh',
    maxWidth: '100%',
    position: 'relative',
    marginLeft: 0,
    padding: 0,
    display: 'flex',
    overflow: 'hidden',
    '&.horizontal': {
      flexDirection: 'row'
    },
    '&.vertical': {
      flexDirection: 'column'
    }
  },
  toolAreaToggle: {
    position: 'absolute',
    '&.MuiFab-root': {
      bottom: theme.spacing(2),
      right: theme.spacing(1)
    },
    '& .MuiSpeedDialAction-fab': {
      backgroundColor: theme.palette.action.hover
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
    height: '100%',
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    overflow: 'hidden',
    '&.invisible': {
      flexGrow: 0
    }
  },
  paneDivider: {
    visibility: 'visible',
    '&.horizontal': {
      borderRight: `2px solid ${theme.palette.divider}`,
      cursor: 'col-resize'
    },
    '&.vertical': {
      borderBottom: `2px solid ${theme.palette.divider}`,
      cursor: 'row-resize'
    },
    '&.invisible': {
      border: 'none',
      visibility: 'hidden'
    }
  }
}))
