import React from 'react'
import {
  ModuleProps,
  TableStats,
  TabularDataFilter,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Table, Bool, Float32Vector, Vector, Float32, BoolVector, Column } from 'apache-arrow'
import { EdgesStructure, NodesStructure } from './structure'
import {
  withStyles,
  Grid,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  NativeSelect,
  Typography,
  FormControlLabel
} from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useElement, NetworkForce, NodeMouseEventDetails } from '@dharpa-vre/datavis-components'
import { useBbox } from '../hooks/useBbox'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'
import './styles.css'

useElement('network-force')

export type GraphDataStructure = {
  degree: Float32
  eigenvector: Float32
  betweenness: Float32
  isLarge: Bool
  isIsolated: Bool
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
  selectedNodeId: NodesStructure['id']
}

interface OutputValues {
  graphData: GraphDataTable
  shortestPath: string[]
  directConnections: NodesStructure['id'][]
}

// just an alias for the mouse event details
type TooltipInfo = NodeMouseEventDetails

const StyledAccordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(Accordion)

type ScalingMethods = keyof Omit<GraphDataStructure, 'isLarge'>

interface NavigationProps {
  nodesScalingMethod: ScalingMethods
  isDisplayIsolated: boolean
  isDisplayLabels: boolean
  onNodesScalingMethodUpdated?: (m: ScalingMethods) => void
  onDisplayIsolatedUpdated?: (isIsolated: boolean) => void
  onDisplayLabelsUpdated?: (arg0: boolean) => void
}

const Navigation = ({
  nodesScalingMethod,
  isDisplayLabels,
  isDisplayIsolated,
  onNodesScalingMethodUpdated,
  onDisplayIsolatedUpdated,
  onDisplayLabelsUpdated
}: NavigationProps): JSX.Element => {
  const [expandedAccordionId, setExpandedAccordionId] = React.useState<number>(null)
  const [labelValue, setLabelValue] = React.useState(null)

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <StyledAccordion
          expanded={expandedAccordionId === 0}
          onChange={(e, isExpanded) => setExpandedAccordionId(isExpanded ? 0 : null)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Nodes appearance</Typography>
          </AccordionSummary>

          <AccordionDetails style={{ display: 'block' }}>
            <Grid container direction="row" alignItems="center" style={{ paddingBottom: '.5em' }}>
              <Typography className="accordion-sub">Size</Typography>
              <InfoOutlinedIcon color="inherit" className="vizIconRight" />
            </Grid>

            <FormControl>
              <NativeSelect
                style={{
                  borderBottom: '0px',
                  borderRadius: 1,
                  paddingLeft: '.5em',
                  border: '1px solid #ced4da'
                }}
                value={nodesScalingMethod ?? ''}
                onChange={e => onNodesScalingMethodUpdated?.(e.target.value as ScalingMethods)}
              >
                <option value="equal">Equal</option>
                <option value="degree">Most connections to other nodes (hubs)</option>
                <option value="betweenness">Bridges between groups of nodes (brokers)</option>
                <option value="eigenvector">Best connected to hubs</option>
                <option value="closeness">Closer to other nodes</option>
                <option value="eccentricity">Outliers</option>
              </NativeSelect>
            </FormControl>
            <Grid
              container
              direction="row"
              alignItems="center"
              style={{ paddingBottom: '.5em', marginTop: '1.5em' }}
            >
              <Typography className="accordion-sub">Labels</Typography>
              <InfoOutlinedIcon color="inherit" className="vizIconRight" />
            </Grid>

            <FormControl style={{ width: '100%' }}>
              <NativeSelect
                style={{
                  width: '100%',
                  borderBottom: '0px',
                  borderRadius: 1,
                  paddingLeft: '.5em',
                  border: '1px solid #ced4da'
                }}
                value={labelValue ?? undefined}
                onChange={e => {
                  e.target.value == 'none' ? onDisplayLabelsUpdated?.(false) : onDisplayLabelsUpdated?.(true)
                  setLabelValue(e.target.value)
                }}
              >
                <option value="none">None</option>
                <option value="label">Label</option>
              </NativeSelect>
            </FormControl>
            {isDisplayLabels == true && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDisplayIsolated}
                    onChange={() => onDisplayIsolatedUpdated?.(!isDisplayIsolated)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                }
                label="Remove labels on smaller nodes"
              />
            )}
          </AccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          expanded={expandedAccordionId === 1}
          onChange={(e, isExpanded) => setExpandedAccordionId(isExpanded ? 1 : null)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Edges appearance</Typography>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          expanded={expandedAccordionId === 2}
          onChange={(e, isExpanded) => setExpandedAccordionId(isExpanded ? 2 : null)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Filter/Topology/Layout</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!isDisplayIsolated}
                  onChange={() => onDisplayIsolatedUpdated?.(!isDisplayIsolated)}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Remove isolated nodes"
            />
          </AccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          expanded={expandedAccordionId === 3}
          onChange={(e, isExpanded) => setExpandedAccordionId(isExpanded ? 3 : null)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Shortest path</Typography>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          expanded={expandedAccordionId === 4}
          onChange={(e, isExpanded) => setExpandedAccordionId(isExpanded ? 4 : null)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Communities</Typography>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </StyledAccordion>
      </Grid>
      <Grid item></Grid>
    </Grid>
  )
}

const normalizeColumn = (column: Column<Float32>): number[] => {
  if (column == null) return undefined
  const items = [...column]
  const max = items.reduce((acc, v) => (v > acc ? v : acc), 0)
  return items.map(v => v / max)
}

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataVis = ({ step }: Props): JSX.Element => {
  const [nodes] = useStepInputValue<NodesTable>(step.stepId, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<EdgesTable>(step.stepId, 'edges', { fullValue: true })
  const [graphData] = useStepOutputValue<GraphDataTable>(step.stepId, 'graphData', { fullValue: true })
  //const [shortestPath] = useStepOutputValue<string[]>(step.stepId, 'shortestPath')
  const [nodesScalingMethod, setNodesScalingMethod] = React.useState<ScalingMethods>(null)
  const [isDisplayLabels, setIsDisplayLabels] = React.useState(false)
  const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(true)
  const [isDisplayTooltip, setIsDisplayTooltip] = React.useState(false)
  const [graphTooltipInfo, setGraphTooltipInfo] = React.useState<TooltipInfo>(null)

  // ID of the node we will get direct neighbours for
  const [selectedNodeId] = useStepInputValue<InputValues['selectedNodeId']>(step.stepId, 'selectedNodeId')
  // a list of direct connections of the `selectedNodeId` node
  const [selectedNodeDirectConnections] = useStepOutputValue(step.stepId, 'directConnections')

  // nodes page + filter for table view
  const [nodesFilter, setNodesFilter] = React.useState<TabularDataFilter>({ pageSize: 10 })
  const [nodesPage, , nodesStats] = useStepInputValue<NodesTable, TableStats>(
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

  return (
    <Grid container>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Navigation
            nodesScalingMethod={nodesScalingMethod}
            isDisplayIsolated={isDisplayIsolated}
            isDisplayLabels={isDisplayLabels}
            onNodesScalingMethodUpdated={setNodesScalingMethod}
            onDisplayIsolatedUpdated={setIsDisplayIsolated}
            onDisplayLabelsUpdated={setIsDisplayLabels}
          />
        </Grid>
        <Grid item xs={9} ref={graphContainerRef} style={{ position: 'relative' }}>
          {graphTooltipInfo !== null && (
            <div
              style={{
                position: 'absolute',
                left: (graphTooltipInfo.mouseCoordinates.x ?? -10) + 10,
                top: (graphTooltipInfo.mouseCoordinates.y ?? 10) - 10,
                visibility: isDisplayTooltip ? 'visible' : 'hidden',
                background: 'rgba(69,77,93,.9)',
                borderRadius: '.1rem',
                color: '#fff',
                display: 'block',
                fontSize: '11px',
                maxWidth: '320px',
                padding: '.2rem .4rem',
                textOverflow: 'ellipsis',
                whiteSpace: 'pre',
                zIndex: 300
              }}
            >
              <span style={{ display: 'block' }}>Label: {graphTooltipInfo.nodeMetadata.label}</span>
              {!isNaN(graphTooltipInfo.nodeMetadata.scaler) && (
                <span
                  style={{ display: 'block', textTransform: 'capitalize' }}
                >{`${nodesScalingMethod}: ${graphTooltipInfo.nodeMetadata.scaler.toFixed(2)}`}</span>
              )}
              <span style={{ display: 'block' }}>Group: {graphTooltipInfo.nodeMetadata.group}</span>
            </div>
          )}
          <network-force
            displayIsolatedNodes={isDisplayIsolated ? undefined : true}
            displayLabels={isDisplayLabels ? undefined : true}
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

const mockProcessor = ({ nodes, edges, selectedNodeId }: InputValues): OutputValues => {
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

export default withMockProcessor(NetworkAnalysisDataVis, mockProcessor)
