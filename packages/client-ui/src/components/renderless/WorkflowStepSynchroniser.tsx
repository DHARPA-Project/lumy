import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router'

import { LumyWorkflow, useCurrentWorkflow } from '@lumy/client-core'

import { WorkflowContext } from '../../state'

interface WorkflowStepSynchroniserProps {
  stepParameterName: string
  onStepUpdated: (stepId: string) => void
}

const getStepIds = (workflow: LumyWorkflow): string[] => workflow?.ui?.pages?.map(page => page.id)

/**
 * Synchronise workflow steps between the workflow context and
 * the URL.
 *
 * TODO: This component should go away when `WorkflowProjectPage` is
 * gone. It converts current workflow step ID from WorkflowContext's page index
 * and back. This should be done elsewhere and on the fly.
 */
export const WorkflowStepSynchroniser = ({
  stepParameterName,
  onStepUpdated
}: WorkflowStepSynchroniserProps): JSX.Element => {
  const { currentPageIndex, setCurrentPageIndexAndDirection } = useContext(WorkflowContext)
  const params = useParams<{ [key: string]: string }>()
  const stepId = params[stepParameterName]

  const [currentWorkflow] = useCurrentWorkflow()

  useEffect(() => {
    if (currentWorkflow == null) return
    // when the page is created, the source of truth is parameters.
    const stepIds = getStepIds(currentWorkflow)
    const stepIndex = stepIds.indexOf(stepId)
    if (stepIndex >= 0) setCurrentPageIndexAndDirection([stepIndex, 0])
    else setCurrentPageIndexAndDirection([0, 0])
  }, [currentWorkflow])

  useEffect(() => {
    if (currentWorkflow == null) return

    const stepIds = getStepIds(currentWorkflow)
    const stepIndex = stepIds.indexOf(stepId)
    if (stepIndex != currentPageIndex) setCurrentPageIndexAndDirection([stepIndex, 0])
  }, [stepId])

  useEffect(() => {
    if (currentWorkflow == null) return

    const stepIds = getStepIds(currentWorkflow)
    const stepIndex = stepIds.indexOf(stepId)
    if (stepIndex != currentPageIndex) {
      onStepUpdated(stepIds[currentPageIndex])
    }
  }, [currentPageIndex])

  return <></>
}
