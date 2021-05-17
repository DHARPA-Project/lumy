import React from 'react'
import { Grid } from '@material-ui/core'
import { GridCellParams } from '@material-ui/data-grid'
import { Vector } from 'apache-arrow'
import { DefaultRenderer } from './DefaultRenderer'

export interface ListCellRendererParams extends GridCellParams {
  itemRenderer?: (params: GridCellParams) => React.ReactElement
}

export const ListCellRenderer = ({
  value,
  itemRenderer = DefaultRenderer,
  ...rest
}: ListCellRendererParams): JSX.Element => {
  const items: Vector = (value as unknown) as Vector
  const Renderer = itemRenderer ?? DefaultRenderer
  return (
    <Grid container direction="column" spacing={0}>
      {[...items.toArray()].map((item, idx) => (
        <Grid item key={idx}>
          <Renderer {...rest} value={item} />
        </Grid>
      ))}
    </Grid>
  )
}
