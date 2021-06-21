import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  visualizationContainer: {
    display: 'grid',
    gridTemplateColumns: 'fit-content(25%) auto'
  },
  graphContainer: {
    position: 'relative'
  }
}))
