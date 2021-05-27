import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  workflowContainer: {
    minHeight: '100vh',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'fit-content(5%) auto'
  },
  stepContainer: {
    // height: `calc(100vh - 2 * ${theme.layout.pagePadding})`,
    height: '100vh',
    position: 'relative',
    marginLeft: 0,
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.right-squeeze': {
      marginRight: `${theme.layout.toolContainerWidth}`
    },
    '&.right-pinch': {
      marginRight: `${theme.layout.toolBarWidth}`
    }
  }
}))
