import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'

import MultilineChartIcon from '@material-ui/icons/MultilineChart'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    minHeight: '75vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '50vmin'
  }
}))

const ArcDiagram = (): JSX.Element => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <MultilineChartIcon fontSize="inherit" color="primary" />
    </Box>
  )
}

export default ArcDiagram
