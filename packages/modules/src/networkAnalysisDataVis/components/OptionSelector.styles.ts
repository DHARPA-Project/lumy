import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {
    marginBottom: '1.5em'
  },
  labelRoot: {
    marginBottom: '0.5em'
  },
  nativeSelectRoot: {
    borderBottom: '0px',
    borderRadius: 1,
    paddingLeft: '.5em',
    border: '1px solid #ced4da'
  },
  infoIcon: {
    marginLeft: '0.2em',
    color: theme.palette.text.secondary
  },
  formControlRoot: {
    width: '100%'
  }
}))
