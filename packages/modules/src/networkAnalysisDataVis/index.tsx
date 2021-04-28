import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  useStepOutputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Table, Bool, Float32Vector, Vector, Float32 } from 'apache-arrow'
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

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataVis = ({ step }: Props): JSX.Element => {
  const [nodes] = useStepInputValue<NodesTable>(step.stepId, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<EdgesTable>(step.stepId, 'edges', { fullValue: true })
  const [graphData] = useStepOutputValue<GraphDataTable>(step.stepId, 'graphData', { fullValue: true })
  const [nodesScalingMethod, setNodesScalingMethod] = React.useState<string>('equal')
  const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(false)
  const [expandedAccordionId, setExpandedAccordionId] = React.useState<number>(null)
  const graphRef = React.useRef<NetworkForce>(null)
  const graphContainerRef = React.useRef()
  const graphBox = useBbox(graphContainerRef)

  const graphWidth = graphBox?.width ?? 0
  const graphHeight = (graphWidth * 2) / 3

  React.useEffect(() => {
    if (graphRef.current == null || nodes == null || graphData == null) return

    const scalerColumn = graphData.getColumn(nodesScalingMethod as keyof GraphDataStructure)

    graphRef.current.nodes = [...nodes.toArray()].map((node, idx) => ({
      id: node.id,
      group: node.group,
      label: node.label,
      scaler: scalerColumn?.get(idx) as number
    }))
  }, [nodes, nodesScalingMethod, graphData, graphRef.current])

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
                    value={nodesScalingMethod}
                    onChange={e => setNodesScalingMethod(e.target.value)}
                  >
                    <FormControlLabel value="equal" control={<Radio />} label="Equal" />
                    <FormControlLabel value="degree" control={<Radio />} label="Degree" />
                    <FormControlLabel
                      value="betweenness"
                      control={<Radio />}
                      label="Betweenness Centrality"
                    />
                    <FormControlLabel
                      value="eigenvector"
                      control={<Radio />}
                      label="Eigenvector Centrality"
                    />
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
              <Button onClick={() => setIsDisplayIsolated(!isDisplayIsolated)}>
                {isDisplayIsolated ? 'Hide isolated nodes' : 'Display isolated nodes'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9} ref={graphContainerRef}>
          <network-force
            displayIsolatedNodes={isDisplayIsolated ? true : undefined}
            width={graphWidth}
            height={graphHeight}
            ref={graphRef}
          />
        </Grid>
      </Grid>
    </Grid>
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
