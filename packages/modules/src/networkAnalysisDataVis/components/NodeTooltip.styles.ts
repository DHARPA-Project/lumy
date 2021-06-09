import { makeStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'

const shadeOfGrey = 700

export default makeStyles(theme => ({
  root: {
    position: 'absolute',
    background: fade(theme.palette.grey[shadeOfGrey], 0.9),
    textAlign: 'left',
    borderRadius: '.1rem',
    color: theme.palette.getContrastText(theme.palette.grey[shadeOfGrey]),
    display: 'block',
    fontSize: '11px',
    maxWidth: '320px',
    padding: '.2rem .4rem',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre',
    zIndex: 300
  }
}))
