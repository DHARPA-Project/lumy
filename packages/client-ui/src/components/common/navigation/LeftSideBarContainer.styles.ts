import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles<Theme>(theme => ({
  sideBarContainer: {
    position: 'fixed',
    zIndex: theme.zIndex.appBar,
    height: '100vh',
    width: theme.layout.sideBarFullWidth,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.collapsed': {
      width: theme.layout.sideBarCollapsedWidth
    }
  }
}))
