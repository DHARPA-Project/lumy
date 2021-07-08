import { Table, Bool, Float32Vector, Vector, BoolVector, Utf8Vector, Int32Vector } from 'apache-arrow'
import { MockProcessorResult } from '@dharpa-vre/client-core'
import { EdgesStructure, GraphDataStructure, InputValues, NodesStructure, OutputValues } from './structure'

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

  const nodes = Table.new<NodesStructure>(
    [
      Utf8Vector.from(nums.map(i => String(i))),
      Utf8Vector.from(nums.map(i => `Node ${i}`)),
      Utf8Vector.from(nums.map(() => getRandomGroup()))
    ],
    ['id', 'label', 'group']
  )
  const edges = Table.new<EdgesStructure>(
    [
      Utf8Vector.from(cnums.map(() => getRandomNodeId())),
      Utf8Vector.from(cnums.map(() => getRandomNodeId())),
      Int32Vector.from(cnums.map(() => getRandomWeight()))
    ],
    ['srcId', 'tgtId', 'weight']
  )
  return { nodes, edges }
}

export const mockProcessor = ({
  nodes,
  edges,
  selectedNodeId,
  shortestPathSource,
  shortestPathTarget
}: InputValues): MockProcessorResult<InputValues, OutputValues> => {
  if (nodes == null || edges == null) {
    const generated = generateNodesAndEdges()
    nodes = generated.nodes
    edges = generated.edges
  }

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
    inputs: {
      nodes,
      edges
    },
    outputs: {
      graphData,
      shortestPath,
      directConnections,
      graphStats: fakeGraphStats
    }
  }
}
