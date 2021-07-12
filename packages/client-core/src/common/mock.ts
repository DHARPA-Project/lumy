import React from 'react'
import { DataRepositoryItemsTable } from '../hooks'
import { ModuleViewProvider } from './modules'
import { WorkflowPageComponent, WorkflowPageDetails } from './types'

export type MockProcessorResult<I, O> = { inputs?: Partial<I>; outputs?: Partial<O> }
export type MockProcessor<I, O> = (
  inputValues: I,
  dataRepositoryTable?: DataRepositoryItemsTable
) => MockProcessorResult<I, O>

const noOpMockProcessor: MockProcessor<unknown, unknown> = () => ({})

type DefaultIO = { [key: string]: unknown }
export type DataProcessorResult = MockProcessorResult<DefaultIO, DefaultIO>

// https://github.com/facebook/react/blob/5aa0c5671fdddc46092d46420fff84a82df558ac/packages/react/src/ReactLazy.js#L45
interface LazyResult<I, O> {
  mockProcessor?: MockProcessor<I, O>
}
type LazyResultPromise = <I, O>() => Promise<{ default: LazyResult<I, O> }>
interface IntrospectedLazyComponent<I, O> {
  _payload: {
    _status: number
    _result: LazyResult<I, O> | LazyResultPromise
  }
}

const isLazyComponent = <I, O>(c: unknown): c is IntrospectedLazyComponent<I, O> => {
  return typeof (c as IntrospectedLazyComponent<I, O>)?._payload?._status === 'number'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component = (viewProvider.getModulePanel(pageComponent) as unknown) as any
  if (isLazyComponent<I, O>(component)) {
    const status = component._payload._status
    // ready
    if (status === 1) {
      return ((component._payload?._result as LazyResult<I, O>)?.mockProcessor ??
        noOpMockProcessor) as MockProcessor<I, O>
    }
    // rejected
    if (status === 2) {
      console.warn(
        `Could not load mock processor for page component ${pageComponent.id}. Loading of the lazy component has been rejected`
      )
      return noOpMockProcessor as MockProcessor<I, O>
    }
    // pending
    if (status === 0) {
      console.debug(`Lazy component for page component ${pageComponent.id} is still loading`)
      return noOpMockProcessor as MockProcessor<I, O>
    }
    // uninitialized
    if (status === -1) {
      const fn = component._payload?._result as LazyResultPromise
      const promise = fn?.()
      if (promise != null)
        return promise.then(
          result => (result?.default?.mockProcessor ?? noOpMockProcessor) as MockProcessor<I, O>
        )
      return noOpMockProcessor as MockProcessor<I, O>
    }
    console.warn(`Unknown status: ${status}`)
    return noOpMockProcessor as MockProcessor<I, O>
  }
  return component?.mockProcessor ?? noOpMockProcessor
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
