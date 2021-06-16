import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import Button from '@material-ui/core/Button'

import WorkflowContextProvider from '../../context/workflowContext'

import WorkflowContainer from '../common/WorkflowContainer'
import { WorkflowStepSynchroniser } from '../renderless/WorkflowStepSynchroniser'

import useStyles from './WorkflowProjectPage.styles'

interface RouterParams {
  stepId?: string
}
const stepParameterName: keyof RouterParams = 'stepId'

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

  useEffect(() => {
    if (stepId != null && dataSource == null) setDataSource('repository')
  }, [stepId])

  const handleWorkflowStepUpdated = (stepId: string) => {
    history.push(`${pageUrlPrefix}/${stepId}`)
  }

  if (dataSource === 'repository')
    return (
      <WorkflowContextProvider>
        <WorkflowStepSynchroniser
          stepParameterName={stepParameterName}
          onStepUpdated={handleWorkflowStepUpdated}
        />
        <WorkflowContainer />
      </WorkflowContextProvider>
    )

  return (
    <div className={classes.dataSourceSelection}>
      <Button variant="outlined" fullWidth onClick={() => setDataSource('repository')}>
        My repository data
      </Button>

      <p>or</p>

      <Button variant="outlined" fullWidth onClick={() => setDataSource('upload')}>
        Upload new data
      </Button>
    </div>
  )
}

export default WorkflowProjectPage
