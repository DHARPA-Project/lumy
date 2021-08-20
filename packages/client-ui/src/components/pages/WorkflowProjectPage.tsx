import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import WorkflowContextProvider from '../../context/workflowContext'

import WorkflowContainer from '../common/WorkflowContainer'
import { WorkflowStepSynchroniser } from '../renderless/WorkflowStepSynchroniser'

import useStyles from './WorkflowProjectPage.styles'
import {
  useWorkflowList,
  WorkflowListItem,
  LumyWorkflow,
  useLoadWorkflow,
  LoadProgress
} from '@dharpa-vre/client-core'

interface RouterParams {
  stepId?: string
}
const stepParameterName: keyof RouterParams = 'stepId'

/**
 * TODO: This will go away once hardcoded workflows are removed.
 */
const getWorkflow = (workflows: WorkflowListItem[], pageUrlPrefix: string): LumyWorkflow | undefined => {
  if (pageUrlPrefix.includes('network-analysis')) {
    return workflows.find(w => w.name === 'Network Analysis')?.body
  }
}

const WorkflowLoadingProgress = ({ progressMessages }: { progressMessages: LoadProgress[] }): JSX.Element => {
  return (
    <Grid container>
      <Grid item>
        <Typography variant="h4">Loading workflow</Typography>
      </Grid>
      <Grid item>
        {progressMessages.map((msg, idx) => {
          return <Typography key={idx}>{msg.message}</Typography>
        })}
      </Grid>
    </Grid>
  )
}

export interface WorkflowProjectPageProps {
  /**
   * URL prefix of this page without the step ID suffix.
   */
  pageUrlPrefix: string
}

const WorkflowProjectPage = ({ pageUrlPrefix }: WorkflowProjectPageProps): JSX.Element => {
  const classes = useStyles()
  const { stepId } = useParams<RouterParams>()
  const history = useHistory()
  const [dataSource, setDataSource] = useState<'repository' | 'upload'>(null)

  const [workflowList] = useWorkflowList(true)
  const workflowBody = dataSource === 'repository' ? getWorkflow(workflowList, pageUrlPrefix) : undefined
  const [progressMessages, isWorkflowLoading] = useLoadWorkflow(workflowBody)

  useEffect(() => {
    if (stepId != null && dataSource == null) setDataSource('repository')
  }, [stepId])

  const handleWorkflowStepUpdated = (stepId: string) => {
    history.push(`${pageUrlPrefix}/${stepId}`)
  }

  if (dataSource === 'repository') {
    if (workflowBody == null || isWorkflowLoading)
      return <WorkflowLoadingProgress progressMessages={progressMessages} />

    return (
      <WorkflowContextProvider>
        <WorkflowStepSynchroniser
          stepParameterName={stepParameterName}
          onStepUpdated={handleWorkflowStepUpdated}
        />
        <WorkflowContainer />
      </WorkflowContextProvider>
    )
  }

  return (
    <div className={classes.dataSourceSelection}>
      <Button variant="outlined" fullWidth onClick={() => setDataSource('repository')}>
        My repository data
      </Button>

      <p>or</p>

      <Button variant="outlined" fullWidth onClick={() => history.push('/dataregistry/add')}>
        Upload new data
      </Button>
    </div>
  )
}

export default WorkflowProjectPage
