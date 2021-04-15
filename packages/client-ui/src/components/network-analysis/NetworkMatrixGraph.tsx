import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'

import TableChartIcon from '@material-ui/icons/TableChart'

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

const NetworkMatrixGraph = (): JSX.Element => {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <TableChartIcon fontSize="inherit" color="primary" />
    </Box>
  )
}

export default NetworkMatrixGraph
