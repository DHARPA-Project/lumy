import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  naPageContainer: {
    width: '100%'
  },
  headline: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  content: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  block: {
    padding: theme.spacing(3)
  },
  description: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    gridGap: theme.spacing(3)
  },
  workflowTypes: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    overflow: 'hidden'
  },
  buttons: {
    display: 'grid',
    placeItems: 'center',
    padding: theme.spacing(2)
  }
}))
