import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  featureContainer: {
    height: '100%',
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabWrapper: {
    flexDirection: 'row',
    '&>:first-child': {
      marginBottom: '0 !important',
      marginRight: theme.spacing(1)
    }
  },
  tabItem: {
    minWidth: 100,
    flex: 1
  }
}))
