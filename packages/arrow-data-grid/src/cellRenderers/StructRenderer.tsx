import React from 'react'
import { Typography, Box } from '@material-ui/core'
import { GridCellParams } from '@material-ui/data-grid'
import grey from '@material-ui/core/colors/grey'

export const StructRenderer = ({ value }: GridCellParams): JSX.Element => {
  const formattedValue = JSON.stringify(JSON.parse(String(value)), null, 2)
  return (
    <Box mt={1} mb={1} bgcolor={grey[100]} p={1} color={grey[600]} fontWeight="bold">
      <Typography variant="body2" component="code" gutterBottom style={{ whiteSpace: 'pre' }}>
        {formattedValue}
      </Typography>
    </Box>
  )
}
