import React from 'react'
import { Workflow, WorkflowStructureStep } from '@dharpa-vre/client-core'

export interface WorkflowPreviewProps {
  workflow: Workflow
  onStepSelected?: (step: WorkflowStructureStep) => void
}

const withoutParameters = (step: WorkflowStructureStep) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { parameters, ...rest } = step
  return rest
}

export const WorkflowPreview = ({ workflow, onStepSelected }: WorkflowPreviewProps): JSX.Element => {
  return (
    <div>
      <h1>Workflow:</h1>
      <h2>
        {workflow.label} ({workflow.id})
      </h2>
      <h2>Steps:</h2>
      <ul>
        {workflow.structure.steps.map(step => (
          <li key={step.id} onClick={() => onStepSelected?.(step)}>
            <pre>{JSON.stringify(withoutParameters(step), null, 2)}</pre>
          </li>
        ))}
      </ul>
      <pre></pre>
    </div>
  )
}
