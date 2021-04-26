import React from 'react'
import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { WorkflowPreview } from './WorkflowPreview'
import { StatusView } from './StatusView'

export const App = (): JSX.Element => {
  const [workflow] = useCurrentWorkflow()

  const statusView = <StatusView />

  if (workflow == null)
    return (
      <>
        <p>loading workflow...</p>
        {statusView}
      </>
    )

  return (
    <>
      <WorkflowPreview workflow={workflow} />
      {statusView}
    </>
  )
}
