import React from 'react'
import { ModuleViewFactory, LumyWorkflow, WorkflowPageDetails } from '@lumy/client-core'
import { Paper, Grid, Typography, Box, Collapse } from '@material-ui/core'

export interface WorkflowPreviewProps {
  workflow: LumyWorkflow
  onStepSelected?: (pageDetails: WorkflowPageDetails) => void
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
          {workflow.meta.label}
        </Typography>
      </Grid>
      <Grid container direction="column" spacing={1} wrap="nowrap" style={{ overflowY: 'auto' }}>
        {workflow.ui.pages?.map(pageDetails => (
          <Grid item key={pageDetails.id}>
            <Paper onClick={() => onStepSelected?.(pageDetails)} elevation={0} variant="outlined">
              <Box
                bgcolor="primary.main"
                color="primary.contrastText"
                p={1}
                onClick={() => toggleCollapse(pageDetails.id)}
              >
                {pageDetails.id}
              </Box>
              <Collapse in={!collapsedStepIds.includes(pageDetails.id)}>
                <Box m={1}>
                  <ModuleViewFactory pageDetails={pageDetails} />
                </Box>
              </Collapse>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
}
