import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  toolBarIcon: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(2)
    }
  }
}))
