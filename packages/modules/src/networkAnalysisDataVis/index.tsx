import React from 'react'
import {
  ModuleProps,
  TableStats,
  TabularDataFilter,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Column, Float32 } from 'apache-arrow'
import { GraphDataStructure, InputValues, OutputValues } from './structure'
import { Grid } from '@material-ui/core'
import { useElement, NetworkForce, NodeMouseEventDetails } from '@dharpa-vre/datavis-components'
import { useBbox } from '../hooks/useBbox'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'
import { NavigationPanel, NavigationPanelSection } from './NavigationPanel'
import { NodesAppearance } from './navigationSections/NodesAppearance'
import { FilterTopologyLayout } from './navigationSections/FilterTopologyLayout'
import { NodeTooltip } from './NodeTooltip'
import { mockProcessor } from './mockProcessor'

useElement('network-force')

type ScalingMethods = keyof Omit<GraphDataStructure, 'isLarge'>

const normalizeColumn = (column: Column<Float32>): number[] => {
  if (column == null) return undefined
  const items = [...column]
  const max = items.reduce((acc, v) => (v > acc ? v : acc), 0)
  return items.map(v => v / max)
}

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataVis = ({ step }: Props): JSX.Element => {
  const [nodes] = useStepInputValue<InputValues['nodes']>(step.stepId, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<InputValues['edges']>(step.stepId, 'edges', { fullValue: true })
  const [graphData] = useStepOutputValue<OutputValues['graphData']>(step.stepId, 'graphData', {
    fullValue: true
  })
  //const [shortestPath] = useStepOutputValue<string[]>(step.stepId, 'shortestPath')
  const [nodesScalingMethod, setNodesScalingMethod] = React.useState<ScalingMethods>('degree')
  const [isDisplayLabels, setIsDisplayLabels] = React.useState(false)
  const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(true)
  const [isDisplayTooltip, setIsDisplayTooltip] = React.useState(false)
  const [graphTooltipInfo, setGraphTooltipInfo] = React.useState<NodeMouseEventDetails>(null)

  // ID of the node we will get direct neighbours for
  const [selectedNodeId] = useStepInputValue<InputValues['selectedNodeId']>(step.stepId, 'selectedNodeId')
  // a list of direct connections of the `selectedNodeId` node
  const [selectedNodeDirectConnections] = useStepOutputValue(step.stepId, 'directConnections')

  // nodes page + filter for table view
  const [nodesFilter, setNodesFilter] = React.useState<TabularDataFilter>({ pageSize: 10 })
  const [nodesPage, , nodesStats] = useStepInputValue<InputValues['nodes'], TableStats>(
    step.stepId,
    'nodes',
    nodesFilter
  )

  const graphRef = React.useRef<NetworkForce>(null)
  const graphContainerRef = React.useRef()
  const graphBox = useBbox(graphContainerRef)

  const handleGraphNodeMouseMove = (event: CustomEvent<NodeMouseEventDetails>) => {
    setGraphTooltipInfo(event.detail)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGraphNodeHovered = (event: CustomEvent<NodeMouseEventDetails>) => {
    // TODO: uncomment for direct connection calculation
    // const nodeId = event.detail.nodeMetadata.actualNodeId
    // if (nodeId != null) {
    //   setSelectedNodeId((nodeId as unknown) as Utf8)
    // }
    setIsDisplayTooltip(true)
  }

  const handleGraphNodeHoveredOut = () => {
    setIsDisplayTooltip(false)
    // TODO: uncomment for direct connection calculation
    // setSelectedNodeId(null)
  }

  React.useEffect(() => {
    // TODO: handle updated direct connections of currently selected node.
    console.log(`Direct connections of node ${selectedNodeId}: ${selectedNodeDirectConnections}`)
  }, [selectedNodeDirectConnections])

  const graphWidth = graphBox?.width ?? 0
  const graphHeight = (graphWidth * 2) / 3

  React.useEffect(() => {
    if (graphRef.current == null || nodes == null || graphData == null) return

    const scalerColumn = graphData.getColumn(nodesScalingMethod)

    const normalizedScalerColumn = normalizeColumn(scalerColumn as Column<Float32>)

    const graphNodes = [...nodes.toArray()].map((node, idx) => ({
      id: String(node.id),
      group: node.group,
      label: node.label,
      scaler: normalizedScalerColumn?.[idx],
      // setting actual node ID *before* converting it to string
      actualNodeId: node.id
    }))

    if (isDisplayIsolated) {
      graphRef.current.nodes = graphNodes
    } else {
      // filter out isolated nodes
      const isIsolated = [...(graphData.getColumn('isIsolated') ?? [])]
      graphRef.current.nodes = graphNodes.filter((_, idx) => !isIsolated[idx])
    }
  }, [nodes, nodesScalingMethod, graphData, graphRef.current, isDisplayIsolated])

  React.useEffect(() => {
    if (graphRef.current == null || edges == null) return

    graphRef.current.edges = [...edges.toArray()].map(edge => ({
      sourceId: String(edge.srcId),
      targetId: String(edge.tgtId)
    }))
  }, [edges, graphRef.current])

  React.useEffect(() => {
    if (graphRef.current == null) return
    graphRef.current.addEventListener('node-hovered', handleGraphNodeHovered as EventListener)
    graphRef.current.addEventListener('node-mousemove', handleGraphNodeMouseMove as EventListener)
    graphRef.current.addEventListener('node-hovered-out', handleGraphNodeHoveredOut)

    return () => {
      graphRef.current?.removeEventListener('node-hovered', handleGraphNodeHovered as EventListener)
      graphRef.current?.removeEventListener('node-mousemove', handleGraphNodeMouseMove as EventListener)
      graphRef.current?.removeEventListener('node-hovered-out', handleGraphNodeHoveredOut)
    }
  }, [graphRef.current])

  const scalerColumn = graphData?.getColumn(nodesScalingMethod)
  console.log(scalerColumn?.toArray())

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
                nodesColor={'noColor'}
                onNodesColorUpdated={() => undefined}
                nodesSizeThresholdBoundaries={[0, 1]}
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
          {graphTooltipInfo != null && isDisplayTooltip ? (
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
            reapplySimulationOnUpdate={true}
            width={graphWidth}
            height={graphHeight}
            ref={graphRef}
          />
        </Grid>
      </Grid>
      <Grid container>
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
