import { makeStyles } from '@material-ui/core/styles'

import { Theme } from '@lumy/styles'

export default makeStyles<Theme>(theme => ({
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
  }
}))
