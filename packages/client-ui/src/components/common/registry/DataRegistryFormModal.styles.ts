import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  form: {
    width: '100%',
    minWidth: theme.spacing(40),
    maxWidth: theme.breakpoints.width('sm'),
    margin: '0 auto',
    padding: theme.spacing(0),
    display: 'grid',
    gridGap: theme.spacing(1),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr'
    }
  },
  field: {
    width: '100%',
    minWidth: theme.spacing(26)
  },
  noteArea: {
    gridColumn: '1 / span 2',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / span 1'
    }
  },
  notificationBox: {
    gridColumn: '1 / span 2',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / span 1'
    }
  },
  buttonContainer: {
    gridColumn: '1 / span 2',
    [theme.breakpoints.down('sm')]: {
      gridColumn: '1 / span 1'
    },
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
}))
