import { EdgeMetadata, NodeMetadata } from '@dharpa-vre/datavis-components'
import { InputValues, OutputValues, ScalingMethod } from './structure'
import { normalizeNumbers } from './utils'

function filterOutIsolatedNodes(nodes: NodeMetadata[], graphData: OutputValues['graphData']): NodeMetadata[] {
  const isIsolated = [...(graphData.getColumn('isIsolated') ?? [])]
  return nodes.filter((_, idx) => !isIsolated[idx])
}

/**
 * Build nodes list in the format 'network-force' graph understands.
 */
export function buildGraphNodes(
  nodes: InputValues['nodes'],
  graphData: OutputValues['graphData'],
  displayIsolatedNodes: boolean,
  nodeScalingMethod: ScalingMethod
): NodeMetadata[] | undefined {
  if (nodes == null) return undefined

  const scalerColumn = graphData?.getColumn(nodeScalingMethod)
  const normalizedScalerColumn = normalizeNumbers([...(scalerColumn?.toArray() ?? [])])

  const graphNodes: NodeMetadata[] = [...nodes.toArray()].map((node, idx) => ({
    id: String(node.id),
    group: node.group,
    label: node.label,
    scaler: normalizedScalerColumn?.[idx]
  }))

  return displayIsolatedNodes ? graphNodes : filterOutIsolatedNodes(graphNodes, graphData)
}

/**
 * Build edges list in the format 'network-force' graph understands.
 */
export function buildGraphEdges(edges: InputValues['edges']): EdgeMetadata[] | undefined {
  if (edges == null) return undefined
  return [...edges.toArray()].map(edge => ({
    sourceId: String(edge.srcId),
    targetId: String(edge.tgtId)
  }))
}

export interface NodeScalerParameters {
  min: number
  max: number
  step: number
}

export function getNodeScalerParameters(
  graphData: OutputValues['graphData'],
  scalingMethod: ScalingMethod
): NodeScalerParameters {
  const groupValues = [...(graphData?.getColumn(scalingMethod) ?? [])]
  const groupValuesMin = Math.min(...groupValues)
  const groupValuesMax = Math.max(...groupValues)

  // nodesScaler min and max temporary dummy values
  const min = isFinite(groupValuesMin) ? groupValuesMin : 0
  const max = isFinite(groupValuesMax) ? groupValuesMax : 1
  const step = (max - min) / 10

  return {
    min,
    max,
    step
  }
}
