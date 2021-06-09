import { Table, Bool, Float32Vector, Vector, BoolVector } from 'apache-arrow'
import { GraphDataStructure, InputValues, OutputValues } from './structure'

export const mockProcessor = ({ nodes, edges, selectedNodeId }: InputValues): OutputValues => {
  const numNodes = nodes?.length ?? 0
  const nums = [...new Array(numNodes).keys()]
  const notIsolatedNodesIds = new Set([...edges.getColumn('srcId')].concat([...edges.getColumn('tgtId')]))
  const isIsolated = [...nodes.getColumn('id')].map(id => !notIsolatedNodesIds.has(id))

  const graphData = Table.new<GraphDataStructure>(
    [
      Float32Vector.from(nums.map(() => Math.random())),
      Float32Vector.from(nums.map(() => Math.random())),
      Float32Vector.from(nums.map(() => Math.random())),
      Vector.from({
        values: nums.map(() => (Math.random() > 0.5 ? true : null)),
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

  return {
    graphData,
    shortestPath: [],
    directConnections
  }
}
