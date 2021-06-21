import { makeStyles } from '@material-ui/core/styles'

export default makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4)
  },
  itemText: {
    '& .MuiTypography-displayBlock': {
      display: 'flex',
      alignItems: 'center'
    }
  }
}))
