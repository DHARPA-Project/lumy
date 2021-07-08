import { makeStyles, Theme } from '@material-ui/core/styles'

export default makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(4)
  },
  itemTextContainer: {
    '& .MuiTypography-displayBlock': {
      display: 'flex',
      alignItems: 'center'
    }
  },
  itemTextContent: {
    '&:hover': {
      color: theme.palette.primary.main,
      fontWeight: theme.typography.fontWeightBold,
      cursor: 'pointer'
    }
  }
}))
