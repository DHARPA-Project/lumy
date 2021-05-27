import { makeStyles } from '@material-ui/core/styles'

import 'easymde/dist/easymde.min.css'

export default makeStyles(theme => ({
  root: {},
  tabBarContainer: {
    justifyContent: 'space-evenly',
    '& .MuiTab-root': {
      width: '80%',
      maxWidth: '80%',
      flexGrow: 0,
      flexShrink: 1,
      '& .MuiTab-wrapper': {
        flexDirection: 'row'
      }
    },
    '& .MuiTab-labelIcon .MuiTab-wrapper > *:first-child': {
      marginBottom: 0,
      marginRight: theme.spacing(1)
    }
  },
  mainSectionContainer: {
    minHeight: theme.breakpoints.values['sm'] / 3
  }
}))
