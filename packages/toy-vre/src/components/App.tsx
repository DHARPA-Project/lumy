import React from 'react'
import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { Box, Grid, LinearProgress, Typography } from '@material-ui/core'
import { StatusView } from './StatusView'
import { WorkflowPreview } from './WorkflowPreview'

const LoadingView = () => {
  return (
    <Grid container style={{ flexGrow: 1 }} direction="column" justify="center" alignItems="center">
      <Typography variant="h6" component="h2" align="center">
        Loading workflow
      </Typography>
      <LinearProgress style={{ width: '100%' }} />
    </Grid>
  )
}

export const App = (): JSX.Element => {
  const [workflow] = useCurrentWorkflow()

  return (
    <>
      <div style={{ overflowX: 'hidden', overflowY: 'scroll', flexGrow: 1, display: 'flex' }}>
        {workflow == null ? <LoadingView /> : <WorkflowPreview workflow={workflow} />}
      </div>
      <Box pt={1}>
        <StatusView />
      </Box>
    </>
  )
}
