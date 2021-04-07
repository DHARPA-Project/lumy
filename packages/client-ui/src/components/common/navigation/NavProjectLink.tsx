import React from 'react'
import { NavLink } from 'react-router-dom'

import useStyles from './NavProjectLink.styles'

import Grow from '@material-ui/core/Grow'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import ProjectProgressBar from '../ProjectProgressBar'

interface NavProjectLinkProps {
  isSideBarExpanded: boolean
  label: string
  link: string
  currentStep: number
  totalSteps: number
}

const NavProjectLink = ({
  isSideBarExpanded,
  label,
  link,
  currentStep,
  totalSteps
}: NavProjectLinkProps): JSX.Element => {
  const classes = useStyles()

  const progressPercentage = (100 * (currentStep - 1)) / totalSteps

  return (
    <Grow
      in={isSideBarExpanded}
      style={{ transformOrigin: '0 0 0' }}
      {...(isSideBarExpanded ? { timeout: 1000 } : { timeout: 0 })}
    >
      <ListItem button component={link && NavLink} to={link} className={classes.root} disableRipple>
        <Grid container spacing={1}>
          <Grid item xs={10}>
            <Typography className={classes.label}>{label}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography className={classes.steps}>{`${currentStep}/${totalSteps}`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ProjectProgressBar value={progressPercentage} variant="determinate" />
          </Grid>
        </Grid>
      </ListItem>
    </Grow>
  )
}

export default NavProjectLink
