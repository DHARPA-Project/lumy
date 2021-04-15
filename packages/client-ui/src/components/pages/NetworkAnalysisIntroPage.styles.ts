import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    width: '100%'
  },
  headline: {
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    textAlign: 'center'
  },
  content: {
    display: 'grid',
    gridGap: theme.spacing(3),
    gridTemplateColumns: '1fr 3fr',
    gridTemplateAreas: `
    "projects preview"
    `,
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: 'auto',
      gridTemplateAreas: `
      "preview"
      "projects"
      `
    },
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  block: {
    padding: theme.spacing(3)
  },
  preview: {
    minHeight: '5rem',
    gridArea: 'preview'
  },
  projects: {
    minHeight: '5rem',
    gridArea: 'projects',
    display: 'flex',
    flexDirection: 'column'
  },
  createProjectButton: {
    margin: `${theme.spacing(3)}px auto ${theme.spacing(3)}px`
  }
}))
