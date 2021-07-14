import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  codeViewContainer: {
    '& .jupyter-viewer .block .cell-row .cell-content.source-markdown': {
      fontFamily: theme.typography.fontFamily
    }
  },
  top: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1)
  }
}))
