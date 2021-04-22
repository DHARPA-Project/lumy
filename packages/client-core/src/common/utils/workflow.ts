import { PipelineState, StepDesc } from '../types'

const PipelineTag = '__pipeline__'

const onlyStepConnections = (connectionTag: string): boolean => !connectionTag.startsWith(PipelineTag)

const parseStepConnectionString = (connectionTag: string): [string, string] => {
  const parts = connectionTag.split('.')
  if (parts.length !== 2) throw new Error(`Could not parse module connection string: "${connectionTag}"`)
  const [stepId, ioId] = parts
  return [stepId, ioId]
}

/**
 * Return a list of connected inputs for a module output.
 *
 * @returns a pair of `stepId` and `inputId`.
 */
export function getConnectedInputs(
  pipelineState: PipelineState,
  stepId: string,
  outputId: string
): [string, string][] {
  const stepDesc = pipelineState?.structure?.steps?.[stepId]
  const outputConnection = stepDesc?.outputConnections?.[outputId] ?? []
  const modulesConnections = outputConnection.filter(onlyStepConnections)
  return modulesConnections.map(parseStepConnectionString)
}

export function getStepsConnections(
  connections: StepDesc['inputConnections'],
  inputId: string
): [string, string][] {
  return connections?.[inputId]?.filter(onlyStepConnections).map(parseStepConnectionString)
}