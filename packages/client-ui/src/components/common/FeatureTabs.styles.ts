import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  featureContainer: {
    height: '100%',
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabList: {
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      '& .MuiSvgIcon-root': {
        marginBottom: 0,
        marginRight: theme.spacing(1)
      }
    }
  },
  tabItem: {
    minWidth: 100,
    flex: 1
  }
}))
