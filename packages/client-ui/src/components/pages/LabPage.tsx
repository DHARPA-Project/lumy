import React from 'react'

import { WorkflowProvider } from '../../state'

import WorkflowContainer from '../common/WorkflowContainer'

/** TODO: not used. consider removing */
const LabPage = (): JSX.Element => {
  return (
    <WorkflowProvider>
      <WorkflowContainer />
    </WorkflowProvider>
  )
}

export default LabPage
