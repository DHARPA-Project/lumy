import { lighten, makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  row: {
    '&:not($selected):nth-of-type(even)': {
      backgroundColor: theme.palette.grey[50]
    },
    '&$selected:nth-of-type(even)':
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          }
  },
  selected:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  borderless: {
    border: 'none'
  },
  condensed: {
    width: theme.spacing(10)
  },
  button: {
    minWidth: 0,
    margin: 0
  },
  previewIcon: {
    fontSize: '1rem'
  }
}))
