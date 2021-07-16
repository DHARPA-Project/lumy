import { Table, Int32, Utf8, Float32, Bool } from 'apache-arrow'

type NodeId = string

export type EdgesStructure = {
  source: Utf8
  target: Utf8
  weight: Int32
}

export type NodesStructure = {
  id: Utf8
  label: Utf8
  group: Utf8
}

export type CentralityMeasures = {
  degree: Float32
  eigenvector: Float32
  betweenness: Float32
  indegree: Float32
  outdegree: Float32
  isolated: Bool
}

export type FullNodesStructure = NodesStructure & CentralityMeasures

export type ScalingMethod = keyof Omit<CentralityMeasures, 'isolated'>

type NodesTable = Table<FullNodesStructure>
type EdgesTable = Table<EdgesStructure>

enum ShortestPathMethod {
  Weighted = 'weighted',
  NotWeighted = 'notWeighted'
}

// enum GraphType {
//   Directed = 'directed',
//   Undirected = 'undirected'
// }

export interface GraphStats {
  nodesCount: number
  edgesCount: number
  averageDegree: number
  averageInDegree: number
  averageOutDegree: number
  density: number
  averageShortestPathLength: number
  // graphType: GraphType
}

export interface InputValues {
  shortestPathSource: NodeId
  shortestPathTarget: NodeId
  shortestPathMethod: ShortestPathMethod
  selectedNodeId: NodeId
}

interface BaseOutputValues {
  nodes: NodesTable
  edges: EdgesTable
  shortestPath: NodeId[]
  directConnections: NodeId[]
}

export type OutputValues = BaseOutputValues & GraphStats
