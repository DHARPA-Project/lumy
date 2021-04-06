import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    height: '100vh',
    width: '100vw',
    display: 'grid',
    gridTemplateColumns: `fit-content(${theme.layout.sideBarFullWidth}) auto`,
    gridTemplateAreas: `'sidebar page'`,
    '&.collapsed': {
      gridTemplateColumns: `fit-content(${theme.layout.sideBarCollapsedWidth}) auto`
    }
  },
  pageContent: {
    gridArea: 'page',
    height: '100vh',
    minWidth: `calc(100vw - ${theme.layout.sideBarFullWidth}px)`,
    padding: theme.spacing(3)
  }
}))
