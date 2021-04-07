import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import { getCurrentDate } from '../../utils/date'

const useStyles = makeStyles({
  date: {
    flex: 1
  }
})

const Summary: React.FC = () => {
  const classes = useStyles()

  const handleLinkClick = (event: React.MouseEvent): void => {
    event.preventDefault()
  }

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Summary
      </Typography>

      <Typography component="p" variant="h4">
        1,488 users
      </Typography>
      <Typography color="textSecondary" className={classes.date}>
        on {getCurrentDate()}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={handleLinkClick}>
          detailed user statistics
        </Link>
      </div>
    </React.Fragment>
  )
}

export default Summary
