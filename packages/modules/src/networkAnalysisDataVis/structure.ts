import { Table, Int32, Utf8, Float32, Bool } from 'apache-arrow'

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

export interface InputValues {
  nodes: NodesTable
  edges: EdgesTable
  shortestPathSource: string
  shortestPathTarget: string
  shortestPathMethod: ShortestPathMethod
  graphType: GraphType
  selectedNodeId: NodesStructure['id']
}

export interface OutputValues {
  graphData: GraphDataTable
  shortestPath: string[]
  directConnections: NodesStructure['id'][]
}
