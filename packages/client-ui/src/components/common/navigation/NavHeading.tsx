import React from 'react'

import Grow from '@material-ui/core/Grow'
import Typography from '@material-ui/core/Typography'

import useStyles from './NavHeading.styles'

type NavHeadingProps = {
  label: string
  isNavBarExpanded: boolean
}

const NavHeading = ({ label, isNavBarExpanded }: NavHeadingProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Grow in={isNavBarExpanded} style={{ transformOrigin: '0 0 0' }} timeout={1000}>
      <Typography className={classes.root + (isNavBarExpanded ? '' : ' invisible')}>{label}</Typography>
    </Grow>
  )
}

export default NavHeading
