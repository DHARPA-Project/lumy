import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  form: {
    width: '100%',
    maxWidth: theme.breakpoints.width('sm'),
    margin: '0 auto',
    padding: theme.spacing(2, 1),
    '& .MuiTextField-root': {
      width: '100%'
    },
    display: 'grid',
    gridGap: theme.spacing(1),
    gridTemplateColumns: '1fr 1fr'
  },
  noteArea: {
    gridColumn: '1 / span 2'
  },
  notificationBox: {
    gridColumn: '1 / span 2'
  },
  linkButton: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  buttonContainer: {
    gridColumn: '1 / span 2',
    display: 'grid',
    placeItems: 'center'
  }
}))
