import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(() => ({
  syntaxHighlighter: {
    width: '100%',
    '& pre': {
      margin: 0,
      padding: 0
    }
  }
}))
