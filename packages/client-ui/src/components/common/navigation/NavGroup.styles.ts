import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  topLink: {
    textDecoration: 'none',
    padding: theme.spacing(1.25),
    '&:hover, &.active': {
      backgroundColor: theme.palette.action.selected
    },
    '&.active $topLinkIcon': {
      color: theme.palette.text.primary
    },
    '&.active $navLinkText': {
      color: theme.palette.text.primary
    }
  },
  topLinkIcon: {
    color: theme.palette.text.secondary,
    transition: theme.transitions.create('color'),
    minWidth: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  navLinkText: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    padding: 0,
    color: theme.palette.text.secondary,
    opacity: 1,
    '&.invisible': {
      width: 0,
      opacity: 0
    }
  },
  nestedList: {
    paddingLeft: theme.spacing(4)
  },
  expandIcon: {
    color: theme.palette.text.secondary,
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard
    }),
    '&.reversed': {
      transform: 'rotate(180deg)'
    }
  }
}))
