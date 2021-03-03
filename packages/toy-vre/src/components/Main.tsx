import React, { useState } from 'react'
import { useCurrentWorkflow, WorkflowStructureStep } from '@dharpa-vre/client-core'
import { WorkflowPreview } from './WorkflowPreview'
import { WorkflowModulePanel } from './WorkflowModulePanel'

export const Main = (): JSX.Element => {
  const [workflow] = useCurrentWorkflow()
  const [currentStep, setCurrentStep] = useState<WorkflowStructureStep>()

  if (workflow == null) return <p>loading workflow...</p>

  const workflowStepPanel = currentStep == null ? '' : <WorkflowModulePanel step={currentStep} />
  return (
    <>
      <WorkflowPreview workflow={workflow} onStepSelected={setCurrentStep} />
      {workflowStepPanel}
    </>
  )
}
