import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  visualizationContainer: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, 25%) auto'
  },
  graphContainer: {
    height: `calc(100% - 2 * ${theme.layout.scrollBarWidth}px)`,
    position: 'relative'
  }
}))
