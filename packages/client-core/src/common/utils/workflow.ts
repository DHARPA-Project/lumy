// const PipelineTag = '__pipeline__'

import { LumyWorkflow } from '../types'

// const onlyStepConnections = (connectionTag: string): boolean => !connectionTag.startsWith(PipelineTag)

// const parseStepConnectionString = (connectionTag: string): [string, string] => {
//   const parts = connectionTag.split('.')
//   if (parts.length !== 2) throw new Error(`Could not parse module connection string: "${connectionTag}"`)
//   const [stepId, ioId] = parts
//   return [stepId, ioId]
// }

/**
 * Return a list of connected inputs for a module output.
 *
 * @returns a pair of `stepId` and `inputId`.
 */
export function getConnectedInputs(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  workflow: LumyWorkflow,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  pageId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  outputId: string
): [string, string][] {
  // TODO: with Kiara pipeline structure replaced by Lumy Workflow it is only
  // possible to extract such connection from workflow structure if the body
  // of kiara workflow configuration is in the workflow. If kiara workflow
  // is referenced by name, it is impossible to get it.
  return []
  // const stepDesc = pipelineState?.structure?.steps?.[stepId]
  // const outputConnection = stepDesc?.outputConnections?.[outputId] ?? []
  // const modulesConnections = outputConnection.filter(onlyStepConnections)
  // return modulesConnections.map(parseStepConnectionString)
}

// /**
//  * Workflow steps may be defined out of order in the workflow structure but they
//  * have a certain execution order. This helper returns steps IDs in the correct
//  * order of execution.
//  */
// export function getOrderedStepIds(pipelineStructure: PipelineStructure): string[] {
//   return pipelineStructure?.processingStages?.flat() ?? []
// }
