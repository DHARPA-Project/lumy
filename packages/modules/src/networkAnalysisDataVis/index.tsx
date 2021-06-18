import React from 'react'

import { ModuleProps, withMockProcessor } from '@dharpa-vre/client-core'
import { InputValues, OutputValues } from './structure'

import { mockProcessor } from './mockProcessor'
import NetworkGraphContextProvider from './context'

import NetworkAnalysisVisualizationContainer from './components/NetworkAnalysisVisualization'

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisVisualization = ({ step }: Props): JSX.Element => {
  return (
    <NetworkGraphContextProvider step={step}>
      <NetworkAnalysisVisualizationContainer />
    </NetworkGraphContextProvider>
  )
}

export default withMockProcessor(NetworkAnalysisVisualization, mockProcessor)
