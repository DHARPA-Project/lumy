import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  cardRoot: {
    marginBottom: theme.spacing(1)
  },
  cardContentRoot: {
    padding: 0
  },
  tableCellRoot: {
    borderBottom: 'none',
    paddingBottom: theme.spacing(0.5)
  }
}))
