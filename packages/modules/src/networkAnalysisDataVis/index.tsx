import React from 'react'
import {
  ModuleProps,
  TableStats,
  TabularDataFilter,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { ScalingMethod, InputValues, OutputValues } from './structure'
import { Grid } from '@material-ui/core'
import { useElement, NetworkForce, NodeMouseEventDetails } from '@dharpa-vre/datavis-components'
import { useBbox } from '../hooks/useBbox'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'
import { NavigationPanel, NavigationPanelSection } from './components/NavigationPanel'
import { NodesAppearance } from './navigationSections/NodesAppearance'
import { FilterTopologyLayout } from './navigationSections/FilterTopologyLayout'
import { NodeTooltip } from './components/NodeTooltip'
import { mockProcessor } from './mockProcessor'
import { useElementEventCallback } from './hooks'
import { buildGraphEdges, buildGraphNodes } from './graphDataMethods'
import { GraphStatsPanel } from './components/GraphStatsPanel'

useElement('network-force')

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataVis = ({ step }: Props): JSX.Element => {
  /* 1. Get read only module input values */
  const [nodes] = useStepInputValue<InputValues['nodes']>(step.stepId, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<InputValues['edges']>(step.stepId, 'edges', { fullValue: true })

  // nodes page + filter for table view
  const [nodesFilter, setNodesFilter] = React.useState<TabularDataFilter>({ pageSize: 10 })
  const [nodesPage, , nodesStats] = useStepInputValue<InputValues['nodes'], TableStats>(
    step.stepId,
    'nodes',
    nodesFilter
  )

  /* 2. Get input values that we can control */

  // ID of the node we will get direct neighbours for

  // TODO: replace react state variable with backend state variable when
  // reapplying force on update is sorted out
  // const [selectedNodeId, setSelectedNodeId] = useStepInputValue<InputValues['selectedNodeId']>(
  //   step.stepId,
  //   'selectedNodeId'
  // )
  const [selectedNodeId, setSelectedNodeId] = React.useState<InputValues['selectedNodeId']>()

  /* 3. Get output values */
  const [graphData] = useStepOutputValue<OutputValues['graphData']>(step.stepId, 'graphData', {
    fullValue: true
  })

  // a list of direct connections of the `selectedNodeId` node
  const [selectedNodeDirectConnections] = useStepOutputValue(step.stepId, 'directConnections')
  //const [shortestPath] = useStepOutputValue<string[]>(step.stepId, 'shortestPath')
  const [graphStats] = useStepOutputValue<OutputValues['graphStats']>(step.stepId, 'graphStats')

  /* 4. Graph and its container reference - for getting container size */
  const graphRef = React.useRef<NetworkForce>(null)
  const graphContainerRef = React.useRef()
  const graphBox = useBbox(graphContainerRef)

  /* 5. local state variables, mostly for navigation */

  const [nodesScalingMethod, setNodesScalingMethod] = React.useState<ScalingMethod>('degree')
  const [isDisplayLabels, setIsDisplayLabels] = React.useState(false)
  const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(true)
  const [graphTooltipInfo, setGraphTooltipInfo] = React.useState<NodeMouseEventDetails>(null)
  const [labelNodeSizeThreshold, setLabelNodeSizeThreshold] = React.useState<number>(null)

  /* 6. handlers for graph node hover */
  const handleGraphNodeMouseMove = (event: CustomEvent<NodeMouseEventDetails>) => {
    setGraphTooltipInfo(event.detail)
  }

  const handleGraphNodeHovered = (event: CustomEvent<NodeMouseEventDetails>) => {
    setGraphTooltipInfo(event.detail)
    const nodeId = event.detail.nodeMetadata.id
    if (nodeId != null) setSelectedNodeId(nodeId)
  }

  const handleGraphNodeHoveredOut = () => {
    setGraphTooltipInfo(undefined)
    setSelectedNodeId(null)
  }

  React.useEffect(() => {
    // TODO: handle updated direct connections of currently selected node.
    console.log(`Direct connections of node ${selectedNodeId}: ${selectedNodeDirectConnections}`)
  }, [selectedNodeDirectConnections])

  /* 7. Handle changes in nodes, edges, graph data and graph parameters:
        construct new force graph data structures and pass them to the graph
  */
  React.useEffect(() => {
    if (graphRef.current == null) return
    const graphNodes = buildGraphNodes(nodes, graphData, isDisplayIsolated, nodesScalingMethod)
    if (graphNodes != null) graphRef.current.nodes = graphNodes
  }, [nodes, nodesScalingMethod, graphData, graphRef.current, isDisplayIsolated])

  React.useEffect(() => {
    if (graphRef.current == null) return
    const graphEdges = buildGraphEdges(edges)
    if (graphEdges != null) graphRef.current.edges = graphEdges
  }, [edges, graphRef.current])

  useElementEventCallback(graphRef.current, 'node-hovered', handleGraphNodeHovered)
  useElementEventCallback(graphRef.current, 'node-mousemove', handleGraphNodeMouseMove)
  useElementEventCallback(graphRef.current, 'node-hovered-out', handleGraphNodeHoveredOut)

  return (
    <Grid container>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <NavigationPanel>
            <NavigationPanelSection title="Nodes appearance" index="0">
              <NodesAppearance
                nodesScalingMethod={nodesScalingMethod}
                onNodesScalingMethodUpdated={setNodesScalingMethod}
                isDisplayLabels={isDisplayLabels}
                onDisplayLabelsUpdated={setIsDisplayLabels}
                colorCodeNodes={true}
                onColorCodeNodesUpdated={() => undefined}
                labelNodeSizeThreshold={labelNodeSizeThreshold}
                onLabelNodeSizeThresholdUpdated={setLabelNodeSizeThreshold}
                labelNodesSizeThresholdBoundaries={[0, 10]}
              />
            </NavigationPanelSection>
            <NavigationPanelSection title="Edges appearance" index="1"></NavigationPanelSection>
            <NavigationPanelSection title="Filter/Topology/Layout" index="2">
              <FilterTopologyLayout
                isDisplayIsolated={isDisplayIsolated}
                onDisplayIsolatedUpdated={setIsDisplayIsolated}
              />
            </NavigationPanelSection>
            <NavigationPanelSection title="Shortest path" index="3"></NavigationPanelSection>
            <NavigationPanelSection title="Communities" index="4"></NavigationPanelSection>
          </NavigationPanel>
        </Grid>
        <Grid item xs={9} ref={graphContainerRef} style={{ position: 'relative' }}>
          {graphTooltipInfo != null ? (
            <NodeTooltip
              position={{
                left: graphTooltipInfo.mouseCoordinates.x,
                top: graphTooltipInfo.mouseCoordinates.y
              }}
              label={graphTooltipInfo.nodeMetadata.label}
              scalingMethod={nodesScalingMethod}
              scalingValue={graphTooltipInfo.nodeMetadata.scaler}
              group={graphTooltipInfo.nodeMetadata.group}
            />
          ) : (
            ''
          )}
          <network-force
            displayIsolatedNodes={isDisplayIsolated ? undefined : true}
            displayLabels={isDisplayLabels ? undefined : false}
            reapplySimulationOnUpdate={undefined}
            width={graphBox?.width ?? 0}
            height={((graphBox?.width ?? 0) * 2) / 3}
            ref={graphRef}
          />
        </Grid>
      </Grid>
      <Grid container direction="column">
        <Grid item>
          <GraphStatsPanel graphStats={graphStats} />
        </Grid>

        <Grid item style={{ flexGrow: 1 }}>
          <DataGrid
            data={nodesPage}
            stats={nodesStats}
            filter={nodesFilter}
            onFiltering={setNodesFilter}
            condensed
            sortingEnabled
            filteringEnabled
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default withMockProcessor(NetworkAnalysisDataVis, mockProcessor)
