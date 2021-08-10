import { makeStyles } from '@material-ui/core/styles'

import 'easymde/dist/easymde.min.css'

export default makeStyles(theme => ({
  root: {},
  tabBarContainer: {
    justifyContent: 'space-evenly'
  },
  tabRoot: {
    width: '80%',
    maxWidth: '80%',
    flexGrow: 0,
    flexShrink: 1
  },
  tabWrapper: {
    flexDirection: 'row'
  },
  tabLabelIcon: {
    marginBottom: 0,
    marginRight: theme.spacing(1)
  },
  mainSectionContainer: {
    minHeight: theme.breakpoints.values['sm'] / 3
  }
}))
