import React from 'react'
import { ModuleViewFactory, PipelineStructure, StepDesc } from '@dharpa-vre/client-core'
import { Paper, Grid, Typography, Box, Collapse } from '@material-ui/core'

export interface WorkflowPreviewProps {
  workflow: PipelineStructure
  onStepSelected?: (step: StepDesc) => void
}

export const WorkflowPreview = ({ workflow, onStepSelected }: WorkflowPreviewProps): JSX.Element => {
  const [collapsedStepIds, setCollapsedStepIds] = React.useState<string[]>([])

  const toggleCollapse = (stepId: string) => {
    if (collapsedStepIds.includes(stepId)) setCollapsedStepIds(collapsedStepIds.filter(id => id !== stepId))
    else setCollapsedStepIds(collapsedStepIds.concat([stepId]))
  }

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid container justify="center">
        <Typography variant="h5" component="h1">
          {workflow.pipelineId}
        </Typography>
      </Grid>
      <Grid container direction="column" spacing={1} wrap="nowrap" style={{ overflowY: 'auto' }}>
        {Object.values(workflow.steps).map(stepDesc => (
          <Grid item key={stepDesc.step.stepId}>
            <Paper onClick={() => onStepSelected?.(stepDesc)} elevation={0} variant="outlined">
              <Box
                bgcolor="primary.main"
                color="primary.contrastText"
                p={1}
                onClick={() => toggleCollapse(stepDesc.step.stepId)}
              >
                {stepDesc.step.moduleType} [{stepDesc.step.stepId}]
              </Box>
              <Collapse in={!collapsedStepIds.includes(stepDesc.step.stepId)}>
                <Box m={1}>
                  <ModuleViewFactory
                    step={stepDesc.step}
                    inputConnections={stepDesc.inputConnections}
                    outputConnections={stepDesc.outputConnections}
                  />
                </Box>
              </Collapse>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
