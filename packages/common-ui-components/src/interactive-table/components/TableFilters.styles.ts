import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  filterContainer: {
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(3)
  },
  header: {
    width: '100%',
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    flex: '0 0 auto'
  },
  title: {
    display: 'inline-flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    fontSize: theme.typography.fontSize,
    fontWeight: theme.typography.fontWeightMedium
  },
  card: {
    padding: theme.spacing(2)
  }
}))
