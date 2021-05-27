import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  stepContent: {
    // height: `calc(100vh - 2 * ${theme.layout.pagePadding})`,
    height: '100vh',
    // display: 'flex',
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: theme.spacing(2),
    overflow: 'scroll',
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    // backgroundColor: 'rgba(0, 0, 0, 0.05)',
    color: theme.palette.text.primary
    // border: `1px solid ${theme.palette.divider}`,
    // borderRadius: theme.shape.borderRadius
  },
  headline: {
    margin: 0,
    marginBottom: theme.spacing(1)
  },
  breadcrumbs: {
    marginBottom: theme.spacing(1)
  },
  divider: {
    marginBottom: theme.spacing(5)
  }
}))
