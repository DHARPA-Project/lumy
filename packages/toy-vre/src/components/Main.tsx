import React from 'react'
import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { WorkflowPreview } from './WorkflowPreview'

export const Main = (): JSX.Element => {
  const [workflow] = useCurrentWorkflow()

  if (workflow == null) return <p>loading workflow...</p>
  return <WorkflowPreview workflow={workflow} />
}
