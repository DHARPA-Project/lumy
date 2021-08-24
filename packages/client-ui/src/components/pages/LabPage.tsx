import React from 'react'

import { generateUniqueId } from '@lumy/utils '

import WorkflowContextProvider from '../../context/workflowContext'

import WorkflowContainer from '../common/WorkflowContainer'

const LabPage = (): JSX.Element => {
  console.log(`unique id: `, generateUniqueId?.())

  return (
    <WorkflowContextProvider>
      <WorkflowContainer />
    </WorkflowContextProvider>
  )
}

export default LabPage
