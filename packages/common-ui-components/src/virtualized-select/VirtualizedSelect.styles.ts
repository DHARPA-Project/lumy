import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  root: {
    width: theme.spacing(45),
    margin: theme.spacing(1, 0)
    // '&$hasClearIcon$hasPopupIcon $inputRoot': {
    //   paddingRight: theme.spacing(4)
    // }
  },
  inputRoot: {
    width: theme.spacing(45)
  },
  hasClearIcon: {},
  hasPopupIcon: {},
  listbox: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0
    }
  }
}))
