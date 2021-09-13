import React from 'react'
import { PipelineUiSchema } from './types'
import { Grid } from '@material-ui/core'
import { ElementView } from './elements/ElementView'

export interface PipelineViewProps {
  pipelineSchema: PipelineUiSchema
}

export const PipelineView = ({ pipelineSchema }: PipelineViewProps): JSX.Element => {
  return (
    <Grid container direction="column">
      <Grid item>
        {pipelineSchema?.inputs?.map((input, idx) => (
          <ElementView key={idx} kind="input" metadata={input} />
        ))}
      </Grid>
      <Grid item>
        {pipelineSchema?.inputs?.map((output, idx) => (
          <ElementView key={idx} kind="output" metadata={output} />
        ))}
      </Grid>
    </Grid>
  )
}
