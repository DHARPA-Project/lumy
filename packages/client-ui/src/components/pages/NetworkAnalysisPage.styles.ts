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
  projects: {
    minHeight: '5rem',
    gridArea: 'projects',
    display: 'flex',
    flexDirection: 'column'
  },
  createProjectButton: {
    margin: `${theme.spacing(3)}px auto ${theme.spacing(3)}px`
  },
  paragraphPlaceholder: {},
  workflowTypes: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardWrapper: {
    maxWidth: theme.spacing(35),
    margin: theme.spacing(2),
    textDecoration: 'none'
  },
  cardImage: {
    display: 'grid',
    placeItems: 'center',
    aspectRatio: '1/1'
  },
  cardActions: {
    display: 'grid',
    placeItems: 'center'
  }
}))
