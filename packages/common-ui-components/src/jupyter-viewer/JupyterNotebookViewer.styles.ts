import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  jupyterViewer: {
    '& .jupyter-viewer .block .cell-row .cell-content.source-markdown': {
      fontFamily: theme.typography.fontFamily
    }
  }
}))
