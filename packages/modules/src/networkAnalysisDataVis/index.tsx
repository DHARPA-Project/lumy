import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Table, Bool, Float32Vector, Vector, Float32 } from 'apache-arrow'
import { EdgesStructure, NodesStructure } from './structure'

export type GraphDataStructure = {
  degree: Float32
  eigenvector: Float32
  betweenness: Float32
  isLarge: Bool
}

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

interface InputValues {
  nodes: NodesTable
  edges: EdgesTable
  shortestPathSource: string
  shortestPathTarget: string
  shortestPathMethod: ShortestPathMethod
  graphType: GraphType
}

interface OutputValues {
  graphData: GraphDataTable
  shortestPath: string[]
}

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataVis = ({ step }: Props): JSX.Element => {
  const [nodes] = useStepInputValue<NodesStructure>(step.stepId, 'nodes', true)
  const [edges] = useStepInputValue<EdgesStructure>(step.stepId, 'edges', true)
  const [graphData] = useStepOutputValue<GraphDataStructure>(step.stepId, 'graphData', true)

  console.log('NetworkAnalysisDataVis', nodes, edges, graphData)

  return <div>[network analysis data vis placeholder]</div>
}

const mockProcessor = ({ nodes }: InputValues): OutputValues => {
  const numNodes = nodes?.length ?? 0
  const nums = [...new Array(numNodes).keys()]

  const graphData = Table.new<GraphDataStructure>(
    [
      Float32Vector.from(nums.map(() => Math.random())),
      Float32Vector.from(nums.map(() => Math.random())),
      Float32Vector.from(nums.map(() => Math.random())),
      Vector.from({
        values: nums.map(() => (Math.random() > 0.5 ? true : null)),
        type: new Bool()
      })
    ],
    ['degree', 'eigenvector', 'betweenness', 'isLarge']
  )

  return {
    graphData,
    shortestPath: []
  }
}

export default withMockProcessor(NetworkAnalysisDataVis, mockProcessor)
