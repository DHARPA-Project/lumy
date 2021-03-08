import React from 'react'
import { ModuleViewFactory, Workflow, WorkflowStep } from '@dharpa-vre/client-core'

export interface WorkflowPreviewProps {
  workflow: Workflow
  onStepSelected?: (step: WorkflowStep) => void
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
            <ModuleViewFactory step={step} />
          </li>
        ))}
      </ul>
      <pre></pre>
    </div>
  )
}
