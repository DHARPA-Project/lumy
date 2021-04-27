import React from 'react'
import { ModuleViewFactory, PipelineStructure, StepDesc } from '@dharpa-vre/client-core'

export interface WorkflowPreviewProps {
  workflow: PipelineStructure
  onStepSelected?: (step: StepDesc) => void
}

export const WorkflowPreview = ({ workflow, onStepSelected }: WorkflowPreviewProps): JSX.Element => {
  return (
    <div>
      <h1>Workflow:</h1>
      <h2>({workflow.pipelineId})</h2>
      <h2>Steps:</h2>
      <ul>
        {Object.values(workflow.steps).map(stepDesc => (
          <li key={stepDesc.step.stepId} onClick={() => onStepSelected?.(stepDesc)}>
            <ModuleViewFactory
              step={stepDesc.step}
              inputConnections={stepDesc.inputConnections}
              outputConnections={stepDesc.outputConnections}
            />
          </li>
        ))}
      </ul>
      <pre></pre>
    </div>
  )
}
