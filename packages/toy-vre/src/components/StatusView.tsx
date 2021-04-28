import React from 'react'
import { State, useLastError, useProcessingState } from '@dharpa-vre/client-core'
import { Box, Grid, Typography } from '@material-ui/core'

export const StatusView = (): JSX.Element => {
  const [lastError] = useLastError()
  const [state = State.Busy] = useProcessingState()

  return (
    <Grid container direction="row">
      <Grid item xs={2} sm={1}>
        <Box bgcolor={state === State.Busy ? 'warning.main' : 'success.main'} p={1} textAlign="center">
          <Typography variant="body2">{state}</Typography>
        </Box>
      </Grid>
      <Grid item xs={10} sm={11}>
        <Box p={1}>
          <Typography variant="body2">Last error:</Typography>
          {lastError != null ? (
            <Typography variant="body1">
              ({lastError.id}): {lastError.message}
            </Typography>
          ) : (
            ''
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
