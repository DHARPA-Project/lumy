import { Table, Int32, Utf8, Float32, Bool } from 'apache-arrow'

type NodeId = string

export type EdgesStructure = {
  srcId: Utf8
  tgtId: Utf8
  weight: Int32
}

export type NodesStructure = {
  id: Utf8
  label: Utf8
  group: Utf8
}

export type GraphDataStructure = {
  degree: Float32
  eigenvector: Float32
  betweenness: Float32
  isLarge: Bool
  isIsolated: Bool
}

export type ScalingMethod = keyof Omit<GraphDataStructure, 'isLarge' | 'isIsolated'>

type GraphDataTable = Table<GraphDataStructure>

type NodesTable = Table<NodesStructure>
type EdgesTable = Table<EdgesStructure>

enum ShortestPathMethod {
  Weighted = 'weighted',
  NotWeighted = 'notWeighted'
}

enum GraphType {
  Directed = 'directed',
  Undirected = 'undirected'
}

interface GraphStats {
  nodesCount: number
  edgesCount: number
  averageInDegree: number
  averageOutDegree: number
  density: number
  averageShortestPathLength: number
}

export interface InputValues {
  nodes: NodesTable
  edges: EdgesTable
  shortestPathSource: NodeId
  shortestPathTarget: NodeId
  shortestPathMethod: ShortestPathMethod
  graphType: GraphType
  selectedNodeId: NodeId
}

export interface OutputValues {
  graphData: GraphDataTable
  shortestPath: NodeId[]
  directConnections: NodeId[]
  graphStats: GraphStats
}
