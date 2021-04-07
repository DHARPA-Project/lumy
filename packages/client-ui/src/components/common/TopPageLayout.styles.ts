import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    width: '100vw',
    '&.collapsed $pageContent': {
      marginLeft: `${theme.layout.sideBarCollapsedWidth}`
    }
  },
  pageContent: {
    minHeight: '100vh',
    marginLeft: `${theme.layout.sideBarFullWidth}`,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    })
  }
}))
