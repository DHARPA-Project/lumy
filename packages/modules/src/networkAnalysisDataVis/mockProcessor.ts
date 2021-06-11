import { Table, Bool, Float32Vector, Vector, BoolVector } from 'apache-arrow'
import { GraphDataStructure, InputValues, OutputValues } from './structure'

type NodeValues = Record<keyof GraphDataStructure, unknown>

const fakeNodesValues: { [nodeId: string]: NodeValues } = {}

const getNodeValues = (nodeId: string): NodeValues => {
  if (fakeNodesValues[nodeId] == null) {
    fakeNodesValues[nodeId] = {
      degree: Math.random(),
      eigenvector: Math.random(),
      betweenness: Math.random(),
      isLarge: Math.random() > 0.5 ? true : null,
      isIsolated: false
    }
  }
  return fakeNodesValues[nodeId]
}

const fakeGraphStats: OutputValues['graphStats'] = {
  nodesCount: Math.random() * 100,
  edgesCount: Math.random() * 100,
  averageInDegree: Math.random(),
  averageOutDegree: Math.random(),
  density: Math.random(),
  averageShortestPathLength: Math.random()
}

export const mockProcessor = ({
  nodes,
  edges,
  selectedNodeId,
  shortestPathSource,
  shortestPathTarget
}: InputValues): OutputValues => {
  const ids = [...nodes.getColumn('id')]

  const notIsolatedNodesIds = new Set([...edges.getColumn('srcId')].concat([...edges.getColumn('tgtId')]))
  const isIsolated = [...nodes.getColumn('id')].map(id => !notIsolatedNodesIds.has(id))

  const graphData = Table.new<GraphDataStructure>(
    [
      Float32Vector.from(ids.map(id => getNodeValues(id).degree)),
      Float32Vector.from(ids.map(id => getNodeValues(id).eigenvector)),
      Float32Vector.from(ids.map(id => getNodeValues(id).betweenness)),
      Vector.from({
        values: ids.map(id => getNodeValues(id).isLarge),
        type: new Bool()
      }),
      BoolVector.from(isIsolated)
    ],
    ['degree', 'eigenvector', 'betweenness', 'isLarge', 'isIsolated']
  )

  let directConnections: OutputValues['directConnections'] = []
  if (selectedNodeId != null) {
    const id = selectedNodeId.toString()
    directConnections = ([...edges]
      .filter(row => row.srcId === id || row.tgtId === id)
      .map(row => (row.srcId === id ? row.tgtId : row.srcId)) as unknown) as OutputValues['directConnections']
  }

  let shortestPath: OutputValues['shortestPath'] = []
  if (shortestPathSource != null && shortestPathTarget != null) {
    shortestPath = [shortestPathSource, shortestPathTarget]
  }

  return {
    graphData,
    shortestPath,
    directConnections,
    graphStats: fakeGraphStats
  }
}
