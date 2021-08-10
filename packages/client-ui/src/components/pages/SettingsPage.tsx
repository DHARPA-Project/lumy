import React, { useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import Brightness4Icon from '@material-ui/icons/Brightness4'
import Brightness7Icon from '@material-ui/icons/Brightness7'

import { ThemeContext } from '@lumy/styles'

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
}))

const SettingsPage = (): JSX.Element => {
  const { darkModeEnabled, toggleDarkMode } = useContext(ThemeContext)

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h5">
        Theme Toggle
      </Typography>

      <IconButton aria-haspopup="true" onClick={toggleDarkMode} color="inherit">
        {darkModeEnabled ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </div>
  )
}

export default SettingsPage
