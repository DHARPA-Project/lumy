import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Table, Bool, Float32Vector, Vector, Float32, BoolVector } from 'apache-arrow'
import { EdgesStructure, NodesStructure } from './structure'
import {
  withStyles,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useElement, NetworkForce } from '@dharpa-vre/datavis-components'
import { useBbox } from '../hooks/useBbox'

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
            <Typography>Nodes size</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <RadioGroup
              value={nodesScalingMethod ?? ''}
              onChange={e => onNodesScalingMethodUpdated?.(e.target.value as ScalingMethods)}
            >
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
            <Typography>Nodes filtering</Typography>
          </AccordionSummary>
          <AccordionDetails></AccordionDetails>
        </StyledAccordion>
      </Grid>
      <Grid item>
        <Button onClick={() => onDisplayIsolatedUpdated?.(!isDisplayIsolated)}>
          {isDisplayIsolated ? 'Hide isolated nodes' : 'Display isolated nodes'}
        </Button>
      </Grid>
    </Grid>
  )
}

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataVis = ({ step }: Props): JSX.Element => {
  const [nodes] = useStepInputValue<NodesTable>(step.stepId, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<EdgesTable>(step.stepId, 'edges', { fullValue: true })
  const [graphData] = useStepOutputValue<GraphDataTable>(step.stepId, 'graphData', { fullValue: true })
  const [nodesScalingMethod, setNodesScalingMethod] = React.useState<ScalingMethods>()
  const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(false)
  const graphRef = React.useRef<NetworkForce>(null)
  const graphContainerRef = React.useRef()
  const graphBox = useBbox(graphContainerRef)

  const graphWidth = graphBox?.width ?? 0
  const graphHeight = (graphWidth * 2) / 3

  React.useEffect(() => {
    if (graphRef.current == null || nodes == null || graphData == null) return

    const scalerColumn = graphData.getColumn(nodesScalingMethod)

    const graphNodes = [...nodes.toArray()].map((node, idx) => ({
      id: node.id,
      group: node.group,
      label: node.label,
      scaler: scalerColumn?.get(idx) as number
    }))

    if (isDisplayIsolated) {
      graphRef.current.nodes = graphNodes
    } else {
      // filter out isolated nodes
      const isIsolated = [...graphData.getColumn('isIsolated')]
      graphRef.current.nodes = graphNodes.filter((_, idx) => !isIsolated[idx])
    }
  }, [nodes, nodesScalingMethod, graphData, graphRef.current, isDisplayIsolated])

  React.useEffect(() => {
    if (graphRef.current == null || edges == null) return

    graphRef.current.edges = [...edges.toArray()].map(edge => ({
      sourceId: edge.srcId,
      targetId: edge.tgtId
    }))
  }, [edges, graphRef.current])

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
          <network-force
            displayIsolatedNodes={isDisplayIsolated ? undefined : true}
            reapplySimulationOnUpdate={true}
            width={graphWidth}
            height={graphHeight}
            ref={graphRef}
          />
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
