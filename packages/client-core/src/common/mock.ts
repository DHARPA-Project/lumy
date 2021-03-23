import React from 'react'
import { ModuleViewProvider } from './modules'

type DefaultIO = { [key: string]: unknown }

export type MockProcessor<I, O> = (inputValues: I) => O

const noOpMockProcessor: MockProcessor<unknown, DefaultIO> = () => ({})

/**
 * This function assumes that a module panel component may have a property
 * called `mockProcessor` with a reference to mock processing function.
 * It also supports `React.lazy` components by sniffing internal React
 * properties of lazy components.
 *
 * If processor is not provided by the component author, a `no-op` processor
 * is returned that returns an empty object.
 */
export const getMockProcessor = <I, O>(
  viewProvider: ModuleViewProvider,
  moduleId: string
): MockProcessor<I, O> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component = (viewProvider.getModulePanel(moduleId) as unknown) as any
  return component?.mockProcessor ?? component?._payload?._result?.mockProcessor ?? noOpMockProcessor
}

export type DataProcessorResult<I = DefaultIO, O = DefaultIO> = {
  inputs: I
  outputs: O
}

export type DataProcessor<I = DataProcessorResult['inputs'], O = DataProcessorResult['outputs']> = (
  stepId: string,
  moduleId: string,
  inputValues: I
) => Promise<DataProcessorResult<I, O>>

export const mockDataProcessorFactory = (viewProvider: ModuleViewProvider) => {
  return async function (
    stepId: string,
    moduleId: string,
    inputValues: DataProcessorResult['inputs']
  ): Promise<DataProcessorResult> {
    console.debug(
      `Mock processing for workflow step "${stepId}" using module "${moduleId}" with values`,
      inputValues
    )

    const outputs = getMockProcessor<DataProcessorResult['inputs'], DataProcessorResult['outputs']>(
      viewProvider,
      moduleId
    )(inputValues)

    return {
      inputs: inputValues,
      outputs
    }
  }
}

/**
 * Enabler function. Makes sure the mock functions are not set in production mode.
 */
export const withMockProcessor = <P, I, O, E = React.ComponentType<P>>(
  component: E,
  mockProcessor: MockProcessor<I, O>
): E => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;((component as unknown) as any).mockProcessor = mockProcessor
  }
  return component
}
