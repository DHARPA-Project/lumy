import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  root: {},
  label: {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 400
  },
  steps: {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 400
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
