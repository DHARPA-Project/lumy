import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles<Theme>(theme => ({
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
  speedDialRoot: {
    position: 'absolute',
    '&$speedDialFab': {
      bottom: theme.spacing(2),
      right: theme.spacing(1)
    },
    '& $speedDialActions': {
      marginBottom: 0,
      paddingBottom: theme.spacing(1)
    }
  },
  speedDialFab: {},
  speedDialActions: {},
  speedDialDirectionUp: {
    bottom: theme.spacing(2),
    right: theme.spacing(1)
  },
  speedDialDirectionDown: {
    top: theme.spacing(2),
    left: theme.spacing(1)
  },
  speedDialDirectionLeft: {
    bottom: theme.spacing(2),
    right: theme.spacing(1)
  },
  speedDialDirectionRight: {
    top: theme.spacing(2),
    left: theme.spacing(1)
  },
  speedDialActionFab: {
    backgroundColor: theme.palette.action.hover
  },
  mainPane: {
    width: '100%',
    display: 'flex',
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
    height: 0,
    width: 0,
    visibility: 'hidden',
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    },
    '&.horizontal': {
      visibility: 'visible',
      height: '100%',
      width: theme.layout.paneDividerWidth,
      cursor: 'col-resize'
    },
    '&.vertical': {
      visibility: 'visible',
      height: theme.layout.paneDividerWidth,
      width: '100%',
      cursor: 'row-resize'
    }
  }
}))
