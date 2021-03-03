import React from 'react'
import { Workflow } from '@dharpa-vre/client-core'

export interface WorkflowPreviewProps {
  workflow: Workflow
}

export const WorkflowPreview = ({ workflow }: WorkflowPreviewProps): JSX.Element => {
  return (
    <>
      <h1>Workflow</h1>
      <pre>{JSON.stringify(workflow, null, 2)}</pre>
    </>
  )
}
