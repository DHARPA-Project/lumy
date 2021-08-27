import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

export default makeStyles((theme: Theme) => ({
  itemContainer: {
    '&:nth-of-type(even) $itemRoot': {
      backgroundColor: theme.palette.grey[50]
    }
  },
  itemRoot: {}
}))
