import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  noWorkflowContainer: {
    display: 'flex'
  },
  noWorkflowPanel: {
    padding: theme.spacing(3, 2),
    width: '100%',
    marginTop: theme.spacing(5)
  }
}))
