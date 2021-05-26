import React from 'react'
import { Box } from '@material-ui/core'
import { GridCellParams } from '@material-ui/data-grid'

export const DefaultRenderer = (params: GridCellParams): JSX.Element => {
  return <Box>{String(params.value)}</Box>
}
