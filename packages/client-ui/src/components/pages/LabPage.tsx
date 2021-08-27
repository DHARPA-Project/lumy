import React from 'react'

import { WorkflowProvider } from '../../state'

import WorkflowContainer from '../common/WorkflowContainer'

const LabPage = (): JSX.Element => {
  return (
    <WorkflowProvider>
      <WorkflowContainer />
    </WorkflowProvider>
  )
}

export default LabPage
