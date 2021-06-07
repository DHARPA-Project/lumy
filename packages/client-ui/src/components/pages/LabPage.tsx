import React from 'react'

import WorkflowContextProvider from '../../context/workflowContext'

import WorkflowContainer from '../common/WorkflowContainer'

const LabPage = (): JSX.Element => {
  return (
    <WorkflowContextProvider>
      <WorkflowContainer />
    </WorkflowContextProvider>
  )
}

export default LabPage
