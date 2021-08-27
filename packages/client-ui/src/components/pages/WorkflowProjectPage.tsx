import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import { WorkflowProvider } from '../../state'

import WorkflowContainer from '../common/WorkflowContainer'
import { WorkflowStepSynchroniser } from '../renderless/WorkflowStepSynchroniser'
import WorkflowLoadingProgressDialog from '../common/WorkflowLoadingProgressDialog'

import useStyles from './WorkflowProjectPage.styles'
import {
  useWorkflowList,
  WorkflowListItem,
  LumyWorkflow,
  useLoadWorkflow,
  LumyWorkflowLoadStatus,
  useCurrentWorkflow
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

  const [currentWorkflow, , isCurrentWorkflowLoading] = useCurrentWorkflow()
  const [workflowList] = useWorkflowList(true)
  const workflowBody = dataSource === 'repository' ? getWorkflow(workflowList, pageUrlPrefix) : undefined
  const [progressMessages, workflowLoadingStatus] = useLoadWorkflow(
    isCurrentWorkflowLoading || currentWorkflow != null ? undefined : workflowBody
  )

  useEffect(() => {
    if (stepId != null && dataSource == null) setDataSource('repository')
  }, [stepId])

  const handleWorkflowStepUpdated = (stepId: string) => {
    history.push(`${pageUrlPrefix}/${stepId}`)
  }

  if (dataSource === 'repository') {
    return (
      <WorkflowProvider>
        <WorkflowStepSynchroniser
          stepParameterName={stepParameterName}
          onStepUpdated={handleWorkflowStepUpdated}
        />

        <WorkflowContainer />

        <WorkflowLoadingProgressDialog
          progressMessages={progressMessages}
          status={workflowLoadingStatus}
          onClose={() => {
            console.info('Cannot close dialog because the page will be in an invalid state')
          }}
          open={workflowBody == null || workflowLoadingStatus === LumyWorkflowLoadStatus.Loading}
        />
      </WorkflowProvider>
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
