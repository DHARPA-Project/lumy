import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'

import BubbleChartIcon from '@material-ui/icons/BubbleChart'

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

const NetworkGraph = (): JSX.Element => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <BubbleChartIcon fontSize="inherit" color="primary" />
    </Box>
  )
}

export default NetworkGraph
