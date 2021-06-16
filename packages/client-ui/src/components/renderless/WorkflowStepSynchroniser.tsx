import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { useCurrentWorkflow, workflowUtils } from '@dharpa-vre/client-core'
import { WorkflowContext } from '../../context/workflowContext'

interface WorkflowStepSynchroniserProps {
  stepParameterName: string
  onStepUpdated: (stepId: string) => void
}

/**
 * Synchronise workflow steps between the workflow context and
 * the URL.
 */
export const WorkflowStepSynchroniser = ({
  stepParameterName,
  onStepUpdated
}: WorkflowStepSynchroniserProps): JSX.Element => {
  const { activeStep, setActiveStep } = useContext(WorkflowContext)
  const params = useParams<{ [key: string]: string }>()
  const stepId = params[stepParameterName]

  const [currentWorkflow] = useCurrentWorkflow()

  useEffect(() => {
    if (currentWorkflow == null) return
    // when the page is created, the source of truth is parameters.
    const stepIds = workflowUtils.getOrderedStepIds(currentWorkflow)
    const stepIndex = stepIds.indexOf(stepId)
    if (stepIndex >= 0) setActiveStep([stepIndex, 0])
    else setActiveStep([0, 0])
  }, [currentWorkflow])

  useEffect(() => {
    if (currentWorkflow == null) return

    const stepIds = workflowUtils.getOrderedStepIds(currentWorkflow)
    const stepIndex = stepIds.indexOf(stepId)
    if (stepIndex != activeStep) setActiveStep([stepIndex, 0])
  }, [stepId])

  useEffect(() => {
    if (currentWorkflow == null) return

    const stepIds = workflowUtils.getOrderedStepIds(currentWorkflow)
    const stepIndex = stepIds.indexOf(stepId)
    if (stepIndex != activeStep) {
      onStepUpdated(stepIds[activeStep])
    }
  }, [activeStep])

  return <></>
}
