import React from 'react'

import { ModuleProps, withMockProcessor } from '@lumy/client-core'

import { mockProcessor } from './mockProcessor'
import NetworkGraphContextProvider from './context'

import NetworkAnalysisVisualizationContainer from './components/NetworkAnalysisVisualization'

const NetworkAnalysisVisualization = ({ pageDetails }: ModuleProps): JSX.Element => {
  return (
    <NetworkGraphContextProvider pageDetails={pageDetails}>
      <NetworkAnalysisVisualizationContainer />
    </NetworkGraphContextProvider>
  )
}

export default withMockProcessor(NetworkAnalysisVisualization, mockProcessor)
