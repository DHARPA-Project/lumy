import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  codeViewContainer: {},
  stickyTop: {
    position: 'sticky',
    top: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    zIndex: 1
  }
}))
