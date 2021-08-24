import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  visualizationContainer: {
    flex: 1,
    display: 'flex'
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll'
  },
  right: {
    flex: 1,
    display: 'flex'
  },
  graphContainer: {
    flex: 1,
    overflow: 'hidden'
  }
}))
