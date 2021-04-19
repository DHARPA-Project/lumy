import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Table, Bool, Float32Vector, Vector, Float32 } from 'apache-arrow'
import { EdgesStructure, NodesStructure } from './structure'
import '@dharpa/web-components'

/**
 * TODO: This will go away when we add types to `@dharpa/web-components`
 */
interface NetworkGraphElement {
  width?: number | string
  height?: number | string
  data?: unknown
  ref?: React.Ref<unknown>
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dharpa-network-force': NetworkGraphElement
    }
  }
}

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
  const [nodes] = useStepInputValue<NodesTable>(step.id, 'nodes', true)
  const [edges] = useStepInputValue<EdgesTable>(step.id, 'edges', true)
  const [graphData] = useStepOutputValue<GraphDataStructure>(step.id, 'graphData', true)
  const graphRef = React.useRef<NetworkGraphElement>(null)

  React.useEffect(() => {
    if (graphRef.current == null) return

    const nodesList = nodes == null ? [] : [...nodes.toArray()]
    const edgesList = edges == null ? [] : [...edges.toArray()]

    const data = {
      nodes: nodesList.map(row => ({
        id: parseInt(row.id, 10),
        label: row.label,
        group: row.group
      })),
      links: edgesList.map(row => ({
        source: parseInt(row.srcId, 10),
        target: parseInt(row.tgtId, 10),
        value: row.weight
      })),
      chartParams: {
        displayIsolatedNodes: 'yes',
        nodesSize: 'equal',
        nodesIdCol: 'Id'
      }
    }

    graphRef.current.data = data
  }, [nodes, edges])

  // console.log('NetworkAnalysisDataVis', nodes, edges, graphData)

  return (
    <div>
      <span>[network analysis data vis placeholder]</span>
      <dharpa-network-force width="600" height="400" ref={graphRef} />
    </div>
  )
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
