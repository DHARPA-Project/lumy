import React from 'react'
import { render } from 'react-dom'
import YAML from 'js-yaml'

import { BackEndContextProvider, LumyWorkflow, useBackendIsReady } from '@lumy/client-core'
import { App, DefaultModuleComponentPanel } from '@lumy/client-ui'

import { SandboxContext } from '@lumy/module-sandbox'

import './index.scss'

import currentWorkflowData from './mock/resources/sampleLumyWorkflow.yml'
import { DynamicModuleViewProviderWithLoader } from './mock/dynamicModuleViewLoader'

const currentWorkflow: LumyWorkflow = YAML.load(currentWorkflowData)

const BackEndAvailabilityScreen = (): JSX.Element => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <p>Backend is not ready yet...</p>

  return <App />
}

const StandaloneApp = (): JSX.Element => {
  const context = React.useRef(
    new SandboxContext({
      currentWorkflow,
      startupDelayMs: 500,
      defaultModuleComponent: DefaultModuleComponentPanel,
      moduleProvider: new DynamicModuleViewProviderWithLoader()
    })
  )

  return (
    <BackEndContextProvider value={context.current}>
      <BackEndAvailabilityScreen />
    </BackEndContextProvider>
  )
}

render(<StandaloneApp />, document.getElementById('root'))
