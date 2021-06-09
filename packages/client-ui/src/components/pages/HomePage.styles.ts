import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  pageContainer: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardWrapper: {
    maxHeight: theme.spacing(35),
    maxWidth: theme.spacing(35),
    margin: theme.spacing(2),
    textDecoration: 'none'
  },
  cardImage: {
    padding: theme.spacing(2),
    display: 'grid',
    placeItems: 'center',
    '& svg': {
      maxHeight: 'fit-content',
      maxWidth: 'fit-content'
    }
  },
  cardActions: {
    display: 'grid',
    placeItems: 'center'
  }
}))
