import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles<Theme>(() => ({
  visualizationContainer: {
    height: '100%',
    flex: 1,
    display: 'flex'
  },
  left: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll'
  },
  right: {
    flex: 1,
    display: 'flex'
  },
  graphContainer: {
    position: 'relative',
    flex: 1,
    overflow: 'hidden'
  }
}))
