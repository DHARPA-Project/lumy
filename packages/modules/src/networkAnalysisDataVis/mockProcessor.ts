import { Table, Float32Vector, BoolVector, Utf8Vector, Int32Vector } from 'apache-arrow'
import { MockProcessorResult } from '@dharpa-vre/client-core'
import {
  EdgesStructure,
  CentralityMeasures,
  InputValues,
  OutputValues,
  GraphStats,
  FullNodesStructure
} from './structure'

type NodeCentralityMeasures = Record<keyof CentralityMeasures, unknown>

const fakeNodesValues: { [nodeId: string]: Omit<NodeCentralityMeasures, 'isolated'> } = {}

const getNodeValues = (nodeId: string): Omit<NodeCentralityMeasures, 'isolated'> => {
  if (fakeNodesValues[nodeId] == null) {
    fakeNodesValues[nodeId] = {
      degree: Math.random() * 90,
      eigenvector: Math.random(),
      betweenness: Math.random(),
      indegree: Math.random() * 90,
      outdegree: Math.random() * 90
    }
  }
  return fakeNodesValues[nodeId]
}

const fakeGraphStats: GraphStats = {
  nodesCount: Math.random() * 100,
  edgesCount: Math.random() * 100,
  averageDegree: Math.random(),
  averageInDegree: Math.random(),
  averageOutDegree: Math.random(),
  density: Math.random(),
  averageShortestPathLength: Math.random()
}

const generateNodesAndEdges = () => {
  const numNodes = 123
  const nums = [...new Array(numNodes).keys()]
  const numConnections = numNodes * 2
  const cnums = [...new Array(numConnections).keys()]

  const groups = ['groupA', 'groupB', 'groupC']
  const getRandomGroup = () => {
    const idx = Math.floor(Math.random() * groups.length)
    return groups[idx]
  }

  const getRandomNodeId = () => {
    const idx = Math.floor(Math.random() * numNodes * 0.9)
    return String(nums[idx])
  }

  const maxWeight = 30
  const getRandomWeight = () => Math.floor(Math.random() * maxWeight)

  const nodeIds = nums.map(String)

  const edges = Table.new<EdgesStructure>(
    [
      Utf8Vector.from(cnums.map(() => getRandomNodeId())),
      Utf8Vector.from(cnums.map(() => getRandomNodeId())),
      Int32Vector.from(cnums.map(() => getRandomWeight()))
    ],
    ['source', 'target', 'weight']
  )

  const notIsolatedNodesIds = new Set([...edges.getColumn('source')].concat([...edges.getColumn('target')]))
  const isIsolated = nodeIds.map(id => !notIsolatedNodesIds.has(id))

  const nodes = Table.new<FullNodesStructure>(
    [
      Utf8Vector.from(nodeIds),
      Utf8Vector.from(nodeIds.map(i => `Node ${i}`)),
      Utf8Vector.from(nodeIds.map(() => getRandomGroup())),

      Float32Vector.from(nodeIds.map(id => getNodeValues(id).degree)),
      Float32Vector.from(nodeIds.map(id => getNodeValues(id).eigenvector)),
      Float32Vector.from(nodeIds.map(id => getNodeValues(id).betweenness)),
      Float32Vector.from(nodeIds.map(id => getNodeValues(id).indegree)),
      Float32Vector.from(nodeIds.map(id => getNodeValues(id).outdegree)),
      BoolVector.from(isIsolated)
    ],
    ['id', 'label', 'group', 'degree', 'eigenvector', 'betweenness', 'indegree', 'outdegree', 'isolated']
  )
  return { nodes, edges }
}

export const mockProcessor = ({
  selectedNodeId,
  shortestPathSource,
  shortestPathTarget
}: InputValues): MockProcessorResult<InputValues, OutputValues> => {
  const generated = generateNodesAndEdges()
  const nodes = generated.nodes
  const edges = generated.edges

  let directConnections: OutputValues['directConnections'] = []
  if (selectedNodeId != null) {
    const id = selectedNodeId.toString()
    directConnections = ([...edges]
      .filter(row => row.source === id || row.target === id)
      .map(row =>
        row.source === id ? row.target : row.source
      ) as unknown) as OutputValues['directConnections']
  }

  let shortestPath: OutputValues['shortestPath'] = []
  if (shortestPathSource != null && shortestPathTarget != null) {
    shortestPath = [shortestPathSource, shortestPathTarget]
  }

  return {
    inputs: {},
    outputs: {
      nodes,
      edges,
      shortestPath,
      directConnections,
      ...fakeGraphStats
    }
  }
}
