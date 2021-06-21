import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  visualizationContainer: {
    height: '100%',
    maxHeight: '100%',
    display: 'grid',
    // gridTemplateColumns: 'fit-content(25%) auto'
    gridTemplateColumns: 'minmax(250px, 25%) auto'
  },
  graphContainer: {
    height: `calc(100% - ${theme.spacing(0.5)}px)`, // subtract size of scroll bar
    maxHeight: `calc(100% - ${theme.spacing(0.5)}px)`, // subtract size of scroll bar
    position: 'relative'
  }
}))
