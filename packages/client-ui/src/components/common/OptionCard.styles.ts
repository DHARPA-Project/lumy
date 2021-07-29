import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  cardWrapper: {
    maxWidth: theme.spacing(35),
    minWidth: theme.spacing(30),
    margin: theme.spacing(2),
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardTop: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  imageContainer: {
    width: '100%',
    flexGrow: 1,
    display: 'grid',
    placeItems: 'center',
    aspectRatio: '1/1'
  },
  backgroundImage: {
    height: '90%',
    width: '90%',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat'
  },
  cardBottom: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardDivider: {
    width: '100%'
  },
  bottomButton: {
    marginTop: theme.spacing(1),
    '&:not(:first-child)': {
      marginLeft: 0
    }
  }
}))
