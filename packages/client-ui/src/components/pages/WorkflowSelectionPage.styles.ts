import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  framePaper: {
    marginTop: theme.spacing(5),
    padding: theme.spacing(5, 3),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  },
  pageLabel: {
    marginBottom: theme.spacing(3)
  },
  listItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  checkedIcon: {
    color: theme.palette.success.light
  }
}))
