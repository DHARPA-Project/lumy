import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  top: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  popoverButton: {
    marginLeft: theme.spacing(1)
  },
  treeContainer: {
    width: '100%',
    flexGrow: 1
  },
  treeItemSelected: {
    '&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
      backgroundColor: 'transparent',
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold
    }
  },
  treeItemLabel: {
    paddingLeft: 0,
    fontWeight: theme.typography.fontWeightMedium
  },
  treeItemDescription: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default
  },
  descriptionText: {
    fontWeight: theme.typography.fontWeightLight
  }
}))
