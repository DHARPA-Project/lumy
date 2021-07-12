import React from 'react'
import { render } from 'react-dom'
import YAML from 'js-yaml'

import { BackEndContextProvider, LumyWorkflow, useBackendIsReady } from '@dharpa-vre/client-core'
import { App } from '@dharpa-vre/client-ui'

import { MockContext } from './mock/context'

import './index.scss'

import currentWorkflowData from './mock/resources/sampleLumyWorkflow.yml'

const currentWorkflow: LumyWorkflow = YAML.load(currentWorkflowData)

const BackEndAvailabilityScreen = (): JSX.Element => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <p>Backend is not ready yet...</p>

  return <App />
}

const StandaloneApp = (): JSX.Element => {
  const context = React.useRef(
    new MockContext({
      currentWorkflow,
      startupDelayMs: 500
    })
  )

  return (
    <BackEndContextProvider value={context.current}>
      <BackEndAvailabilityScreen />
    </BackEndContextProvider>
  )
}

render(<StandaloneApp />, document.getElementById('root'))
