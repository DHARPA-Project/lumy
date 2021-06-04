import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden'
  },
  pageContent: {
    minHeight: '100vh',
    marginLeft: `${theme.layout.sideBarCollapsedWidth}`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    background: 'linear-gradient(110deg, rgba(0, 0, 0, 0.04) 60%, rgba(0, 0, 0, 0.02) 60%)',
    '&.left-pinch': {
      marginLeft: `${theme.layout.sideBarFullWidth}`
    }
  }
}))
