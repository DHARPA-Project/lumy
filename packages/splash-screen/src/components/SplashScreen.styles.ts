import { makeStyles } from '@material-ui/core/styles'
import '@fontsource/roboto'
import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'

export default makeStyles(theme => ({
  container: {
    height: '100vh',
    maxWidth: theme.breakpoints.values['md'],
    margin: '0 auto',
    padding: theme.spacing(2)
  },
  leftColumn: {
    [theme.breakpoints.up('xs')]: {
      // 40 viewport height - container padding bottom
      height: `calc(40vh - ${theme.spacing(2)}px)`
    },
    [theme.breakpoints.up('md')]: {
      // 100 viewport height - container padding top - container padding bottom
      height: `calc(100vh - ${theme.spacing(4)}px)`
    },
    paddingTop: theme.spacing(4)
  },
  rightColumn: {},
  avatar: {
    width: theme.spacing(20),
    height: theme.spacing(20)
  },
  header: {
    fontSize: '3rem',
    textAlign: 'center',
    fontWeight: 100
  },
  subheader: {
    fontSize: '1rem',
    textAlign: 'center',
    fontWeight: 300
  },
  appLoadStatus: {
    height: theme.spacing(12),
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  logContainerWrapper: {
    [theme.breakpoints.up('xs')]: {
      // 60 viewport height - app load status height - container padding bottom
      height: `calc(60vh - ${theme.spacing(14)}px)`
    },
    [theme.breakpoints.up('md')]: {
      // 100 viewport height - app load status height - container padding top - container padding bottom
      height: `calc(100vh - ${theme.spacing(16)}px)`
    },
    width: '100%',
    display: 'flex',
    flex: '0 1 auto'
  }
}))
