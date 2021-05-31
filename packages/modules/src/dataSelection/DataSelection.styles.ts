import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  headline: {
    marginTop: theme.spacing(3)
  },
  section: {
    marginBottom: theme.spacing(2)
  },
  list: {
    padding: 0,
    display: 'flex',
    listStyleType: 'none'
  },
  listItem: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  switch: {
    pointerEvents: 'auto'
  },
  listItemText: {
    margin: theme.spacing(0, 1),
    padding: 0
  }
}))
