import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
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
    /* NOTE: if the height of the container is not fixed, the container
       will infinitely keep growing vertically which will make 
       the graph resize all the time, considerably slowing down rendering
       and making cooling fans of the laptop go crazy. */
    // flex: 1,
    // overflow: 'hidden'
    height: `calc(100% - 2 * ${theme.layout.scrollBarWidth}px)`,
    width: '100%',
    position: 'relative',
    display: 'flex',
    '& *': {
      width: '100%'
    }
  }
}))
