import React from 'react'
import { render } from 'react-dom'
import YAML from 'js-yaml'
import { BackEndContextProvider, useBackendIsReady, Workflow } from '@dharpa-vre/client-core'
import { Main } from '@dharpa-vre/toy-vre'
import { DataProcessorResult, MockContext } from './mock/context'

import './index.scss'

import currentWorkflowData from './mock/resources/sampleWorkflow.yml'

const currentWorkflow: Workflow = YAML.load(currentWorkflowData)

const mockDataProcessor = async (
  stepId: string,
  moduleId: string,
  inputValues: { [inputId: string]: unknown }
): Promise<DataProcessorResult> => {
  console.log(
    `Mock processing for workflow step "${stepId}" using module "${moduleId}" with values`,
    inputValues
  )

  const outputs = []

  if (moduleId === 'twoArgsMathFunction') {
    const { a, b, operator } = inputValues as { a: number; b: number; operator: string }
    let c = 0
    try {
      switch (operator) {
        case 'add':
          c = a + b
          break
        case 'sub':
          c = a - b
          break
        case 'mul':
          c = a * b
          break
        case 'div':
          c = a / b
          break
        case 'pow':
          c = a ** b
          break
      }
    } finally {
      outputs.push({ id: 'c', value: c })
    }
  }
  return {
    inputs: [],
    outputs
  }
}

const App = (): JSX.Element => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <p>Backend is not ready yet...</p>

  return <Main />
}

const StandaloneApp = (): JSX.Element => {
  const context = React.useRef(
    new MockContext({
      processData: mockDataProcessor,
      currentWorkflow,
      startupDelayMs: 500
    })
  )

  return (
    <BackEndContextProvider value={context.current}>
      <App />
    </BackEndContextProvider>
  )
}

render(<StandaloneApp />, document.getElementById('root'))
