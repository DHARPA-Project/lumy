import { EdgeMetadata, NodeMetadata } from '@lumy/datavis-components'
import { OutputValues, ScalingMethod } from './structure'
import { normalizeNumbers } from './utils'

function filterOutIsolatedNodes(nodes: NodeMetadata[], nodesTable: OutputValues['nodes']): NodeMetadata[] {
  const isIsolated = [...(nodesTable.getColumn('isolated') ?? [])]
  return nodes.filter((_, idx) => !isIsolated[idx])
}

/**
 * Build nodes list in the format 'network-force' graph understands.
 */
export function buildGraphNodes(
  nodes: OutputValues['nodes'],
  displayIsolatedNodes: boolean,
  nodeScalingMethod: ScalingMethod
): NodeMetadata[] | undefined {
  if (nodes == null) return undefined

  const scalerColumn = nodes?.getColumn(nodeScalingMethod)
  const scalerColumnValues = [...(scalerColumn?.toArray() ?? [])]
  const normalizedScalerColumn = normalizeNumbers(scalerColumnValues)

  const graphNodes: NodeMetadata[] = [...nodes.toArray()].map((node, idx) => ({
    id: String(node.id),
    group: node.group,
    label: node.label,
    scaler: normalizedScalerColumn?.[idx],
    scalerActualValue: scalerColumnValues?.[idx]
  }))

  return displayIsolatedNodes ? graphNodes : filterOutIsolatedNodes(graphNodes, nodes)
}

/**
 * Build edges list in the format 'network-force' graph understands.
 */
export function buildGraphEdges(edges: OutputValues['edges']): EdgeMetadata[] | undefined {
  if (edges == null) return undefined
  return [...edges.toArray()].map(edge => ({
    sourceId: String(edge.source),
    targetId: String(edge.target)
  }))
}

export interface NodeScalerParameters {
  min: number
  max: number
  step: number
}

export function getNodeScalerParameters(
  nodes: OutputValues['nodes'],
  scalingMethod: ScalingMethod
): NodeScalerParameters {
  const groupValues = [...(nodes?.getColumn(scalingMethod) ?? [])]
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
