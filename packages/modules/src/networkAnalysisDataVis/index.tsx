import React from 'react'
import {
  ModuleProps,
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
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useElement, NetworkForce } from '@dharpa-vre/datavis-components'
import { useBbox } from '../hooks/useBbox'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'

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
}

interface OutputValues {
  graphData: GraphDataTable
  shortestPath: string[]
}

interface TooltipInfo {
  nodeId: number
  nodeLabel: string
  nodeGroup: string
  nodeScaler: number
  x: number
  y: number
}

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
  onNodesScalingMethodUpdated?: (m: ScalingMethods) => void
  onDisplayIsolatedUpdated?: (isIsolated: boolean) => void
}

const Navigation = ({
  nodesScalingMethod,
  isDisplayIsolated,
  onNodesScalingMethodUpdated,
  onDisplayIsolatedUpdated
}: NavigationProps): JSX.Element => {
  const [expandedAccordionId, setExpandedAccordionId] = React.useState<number>(null)

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
          <AccordionDetails>
            <RadioGroup
              value={nodesScalingMethod ?? ''}
              onChange={e => onNodesScalingMethodUpdated?.(e.target.value as ScalingMethods)}
            >
              <Grid container direction="row" alignItems="center">
                Size <InfoOutlinedIcon color="primary" />
              </Grid>

              <FormControlLabel value="" control={<Radio />} label="Equal" />
              <FormControlLabel value="degree" control={<Radio />} label="Degree" />
              <FormControlLabel value="betweenness" control={<Radio />} label="Betweenness Centrality" />
              <FormControlLabel value="eigenvector" control={<Radio />} label="Eigenvector Centrality" />
            </RadioGroup>
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
                  checked={isDisplayIsolated}
                  onChange={() => onDisplayIsolatedUpdated?.(!isDisplayIsolated)}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Display isolated nodes"
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
  //nconst [shortestPath] = useStepOutputValue<string[]>(step.stepId, 'shortestPath')
  const [nodesScalingMethod, setNodesScalingMethod] = React.useState<ScalingMethods>(null)
  const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(false)
  const [isDisplayTooltip, setIsDisplayTooltip] = React.useState(false)
  const [graphTooltipInfo, setGraphTooltipInfo] = React.useState<TooltipInfo>(null)
  const graphRef = React.useRef<NetworkForce>(null)
  const graphContainerRef = React.useRef()
  const graphBox = useBbox(graphContainerRef)

  const handleGraphNodeHovered = () => {
    setIsDisplayTooltip(true)
  }

  const handleGraphNodeMouseMove = (event: unknown) => {
    // console.log(event.detail)
    const tooltipInfo = {
      nodeId: event.detail[0].index,
      nodeGroup: event.detail[0].metadata.group,
      nodeLabel: event.detail[0].metadata.label,
      nodeScaler: +event.detail[0].metadata.scaler,
      x: event.detail[1].pageX + 10,
      y: event.detail[1].pageY - 10
    }
    setGraphTooltipInfo(tooltipInfo)
  }

  const handleGraphNodeHoveredOut = () => {
    setIsDisplayTooltip(false)
  }

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
      scaler: normalizedScalerColumn?.[idx]
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
    graphRef.current.addEventListener('node-hovered', handleGraphNodeHovered)
    graphRef.current.addEventListener('node-mousemove', handleGraphNodeMouseMove)
    graphRef.current.addEventListener('node-hovered-out', handleGraphNodeHoveredOut)
    return () => {
      graphRef.current.removeEventListener('node-hovered', handleGraphNodeHovered)
      graphRef.current.removeEventListener('node-mousemove', handleGraphNodeMouseMove)
      graphRef.current.removeEventListener('node-hovered-out', handleGraphNodeHoveredOut)
    }
  }, [graphRef])

  return (
    <Grid container>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Navigation
            nodesScalingMethod={nodesScalingMethod}
            isDisplayIsolated={isDisplayIsolated}
            onNodesScalingMethodUpdated={setNodesScalingMethod}
            onDisplayIsolatedUpdated={setIsDisplayIsolated}
          />
        </Grid>
        <Grid item xs={9} ref={graphContainerRef}>
          {graphTooltipInfo !== null && (
            <div
              style={{
                position: 'absolute',
                left: graphTooltipInfo !== null ? graphTooltipInfo.x : 0,
                top: graphTooltipInfo !== null ? graphTooltipInfo.y : 0,
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
              <span style={{ display: 'block' }}>Label: {graphTooltipInfo.nodeLabel}</span>
              {!isNaN(graphTooltipInfo.nodeScaler) && (
                <span
                  style={{ display: 'block', textTransform: 'capitalize' }}
                >{`${nodesScalingMethod}: ${graphTooltipInfo.nodeScaler.toFixed(2)}`}</span>
              )}
              <span style={{ display: 'block' }}>Group: {graphTooltipInfo.nodeGroup}</span>
            </div>
          )}
          <network-force
            displayIsolatedNodes={isDisplayIsolated ? undefined : true}
            reapplySimulationOnUpdate={true}
            width={graphWidth}
            height={graphHeight}
            ref={graphRef}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item style={{ flexGrow: 1 }}>
          <DataGrid data={nodes} condensed />
        </Grid>
      </Grid>
    </Grid>
  )
}

const mockProcessor = ({ nodes, edges }: InputValues): OutputValues => {
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

  return {
    graphData,
    shortestPath: []
  }
}

export default withMockProcessor(NetworkAnalysisDataVis, mockProcessor)
