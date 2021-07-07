import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  optionSelectorContainer: {
    marginBottom: '1.5em'
  },
  nativeSelectRoot: {
    paddingLeft: '.5em'
  },
  infoIcon: {
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))
