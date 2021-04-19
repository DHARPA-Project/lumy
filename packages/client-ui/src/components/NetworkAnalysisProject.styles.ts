import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: `3fr minmax(${theme.spacing(40)}px, 1fr)`,
    gridGap: theme.spacing(2)
  },
  summary: {
    padding: theme.spacing(3)
  },
  title: {},
  dataControls: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-evenly'
  }
}))
