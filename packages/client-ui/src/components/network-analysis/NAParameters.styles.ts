import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  root: {
    height: '70vh',
    overflowY: 'scroll'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  accordionBlock: {
    display: 'flex',
    flexDirection: 'column'
  }
}))
