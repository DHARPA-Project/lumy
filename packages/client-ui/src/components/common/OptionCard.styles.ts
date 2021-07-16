import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  cardWrapper: {
    maxWidth: theme.spacing(35),
    margin: theme.spacing(2),
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardImage: {
    display: 'grid',
    placeItems: 'center',
    aspectRatio: '1/1'
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column'
  },
  bottomDivider: {
    width: '100%'
  },
  bottomButton: {
    marginTop: theme.spacing(1),
    '&:not(:first-child)': {
      marginLeft: 0
    }
  }
}))
