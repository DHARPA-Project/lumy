import React, { useState } from 'react'
import { useCurrentWorkflow, StepDesc } from '@dharpa-vre/client-core'
import { WorkflowPreview } from './WorkflowPreview'
import { WorkflowModulePanel } from './WorkflowModulePanel'
import { StatusView } from './StatusView'

export const App = (): JSX.Element => {
  const [workflow] = useCurrentWorkflow()
  const [currentStep, setCurrentStep] = useState<StepDesc>()

  const statusView = <StatusView />

  if (workflow == null)
    return (
      <>
        <p>loading workflow...</p>
        {statusView}
      </>
    )

  const workflowStepPanel = currentStep == null ? '' : <WorkflowModulePanel step={currentStep?.step} />
  return (
    <>
      <WorkflowPreview workflow={workflow} onStepSelected={setCurrentStep} />
      {workflowStepPanel}
      {statusView}
    </>
  )
}
