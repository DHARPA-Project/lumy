import React from 'react'
import { DataRepositoryItemsTable } from '../hooks'
import { ModuleProps, ModuleViewProvider } from './modules'
import { WorkflowPageComponent, WorkflowPageDetails } from './types'
import { getResolvedReactComponent } from './utils/react'

export type MockProcessorResult<I, O> = { inputs?: Partial<I>; outputs?: Partial<O> }
export type MockProcessor<I, O> = (
  inputValues: I,
  dataRepositoryTable?: DataRepositoryItemsTable
) => MockProcessorResult<I, O>

const noOpMockProcessor: MockProcessor<unknown, unknown> = () => ({})

type DefaultIO = { [key: string]: unknown }
export type DataProcessorResult = MockProcessorResult<DefaultIO, DefaultIO>

export interface ComponentWithMockProcessor<I, O> {
  mockProcessor?: MockProcessor<I, O> | Promise<MockProcessor<I, O>>
}

/**
 * This function assumes that a module panel component may have a property
 * called `mockProcessor` with a reference to mock processing function.
 * It also supports `React.lazy` components by sniffing internal React
 * properties of lazy components.
 *
 * If processor is not provided by the component author, a `no-op` processor
 * is returned that returns an empty object.
 */
export const getMockProcessor = async <I, O>(
  viewProvider: ModuleViewProvider,
  pageComponent: WorkflowPageComponent
): Promise<MockProcessor<I, O>> => {
  if (pageComponent == null) return noOpMockProcessor as MockProcessor<I, O>

  const component = await viewProvider.getModulePanel(pageComponent)
  const resolvedComponent = await getResolvedReactComponent<ComponentWithMockProcessor<I, O>, ModuleProps>(
    component
  )

  return resolvedComponent?.mockProcessor ?? noOpMockProcessor
}

export type DataProcessor<I = DefaultIO, O = DefaultIO> = (
  pageDetails: WorkflowPageDetails,
  inputValues: I
) => Promise<MockProcessorResult<I, O>>

export const mockDataProcessorFactory = (
  viewProvider: ModuleViewProvider,
  dataRepositoryTable?: DataRepositoryItemsTable
) => {
  return async function (
    pageDetails: WorkflowPageDetails,
    inputValues: Record<string, unknown>
  ): Promise<MockProcessorResult<unknown, unknown>> {
    console.debug(
      `Mock processing for workflow page "${pageDetails?.id}" using module "${pageDetails?.component?.id}" with values`,
      inputValues
    )

    const processor = await getMockProcessor<unknown, unknown>(viewProvider, pageDetails?.component)

    const { inputs = {}, outputs = {} } = processor(inputValues, dataRepositoryTable)

    return {
      inputs: { ...inputValues, ...inputs },
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
