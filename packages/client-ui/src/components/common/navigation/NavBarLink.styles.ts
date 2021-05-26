import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  link: {
    textDecoration: 'none',
    padding: theme.spacing(1.25),
    '&:hover, &:focus, &.active': {
      backgroundColor: theme.palette.action.selected
    },
    '&.active $linkIcon': {
      color: theme.palette.text.primary
    },
    '&.active $navLinkText': {
      color: theme.palette.text.primary
    }
  },
  linkNested: {
    paddingLeft: 0,
    '&:hover, &:focus': {
      backgroundColor: '#FFFFFF'
    }
  },
  linkIcon: {
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
  }
}))
