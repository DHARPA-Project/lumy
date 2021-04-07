import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {},
  label: {
    color: theme.palette.text.secondary
  },
  steps: {
    color: theme.palette.text.secondary
  },
  note: {
    color: 'red'
  },
  progressBarRoot: {
    height: 5,
    borderRadius: 3
  },
  progressBarColorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  progressBarBar: {
    borderRadius: 3
  }
}))
