import React from 'react'
import { render } from 'react-dom'
import {
  DataContainer,
  InputData,
  ModuleContextProvider,
  OutputData,
  useBackendIsReady
} from '@dharpa-vre/client-core'
import { MockContext } from './mock/context'

import './index.scss'

const mockDataProcessor = async (
  moduleParameters: unknown // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<DataContainer<InputData, OutputData>> => {
  return {
    inputs: {},
    output: {}
  }
}

const Main = (): JSX.Element => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <p>Backend is not ready yet...</p>

  return <p>VRE will be rendered here</p>
}

const StandaloneApp = (): JSX.Element => {
  const context = React.useRef(
    new MockContext('@dharpa/standalone-app-context', {
      processData: mockDataProcessor,
      startupDelayMs: 500
    })
  )

  return (
    <ModuleContextProvider value={context.current}>
      <Main />
    </ModuleContextProvider>
  )
}

render(<StandaloneApp />, document.getElementById('root'))
