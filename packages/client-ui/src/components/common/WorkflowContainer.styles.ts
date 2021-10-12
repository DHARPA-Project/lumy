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
