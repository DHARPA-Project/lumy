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
import { withStyles, Button, Grid, Accordion, AccordionSummary, AccordionDetails, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

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
    const [graphData] = useStepOutputValue<GraphDataTable>(step.id, 'graphData', true)
    const [nodesSize, setNodesSize] = React.useState('default')
    const handleNodesSize = (event) => { setNodesSize(event.target.value) }
    const graphRef = React.useRef<NetworkGraphElement>(null)
    const [isDisplayIsolated, setIsDisplayIsolated] = React.useState(false)


    const StyledAccordion = withStyles({
        root: {
            border: '1px solid rgba(0, 0, 0, .125)',
            boxShadow: 'none',
            '&:not(:last-child)': {
                borderBottom: 0,
            },
            '&:before': {
                display: 'none',
            },
            '&$expanded': {
                margin: 'auto',
            },
        },
        expanded: {},
    })(Accordion)

    React.useEffect(() => {
        if (graphRef.current == null) return

        const nodesList = nodes == null ? [] : [...nodes.toArray()]
        const edgesList = edges == null ? [] : [...edges.toArray()]
        const scalarList = graphData == null ? [] : [...graphData.toArray()].map(row => row.get(nodesSize))

        const data = {
            nodes: nodesList.map((row, idx) => ({
                id: parseInt(row.id, 10),
                label: row.label,
                group: row.group,
                scalar: scalarList[idx]
            })),
            links: edgesList.map(row => ({
                source: parseInt(row.srcId, 10),
                target: parseInt(row.tgtId, 10),
                value: row.weight
            })),
            chartParams: {
                displayIsolatedNodes: isDisplayIsolated ? 'yes' : 'no',
                nodesSize: 'degree',
                nodesIdCol: 'Id'
            }
        }

        graphRef.current.nodes = data.nodes
        graphRef.current.edges = data.edges
    }, [nodes, edges, isDisplayIsolated])

    // console.log('NetworkAnalysisDataVis', nodes, edges, graphData)

    return (
        <Grid container>
            <Grid container spacing={3}>
                <Grid item xs={3}>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Nodes size</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <RadioGroup value={nodesSize} onChange={handleNodesSize}>
                                <FormControlLabel value="equal" control={<Radio />} label="Equal" />
                                <FormControlLabel value="degree" control={<Radio />} label="Degree" />
                                <FormControlLabel value="betweenness" control={<Radio />} label="Betweenness Centrality" />
                                <FormControlLabel value="eigenvector" control={<Radio />} label="Eigenvector Centrality" />
                            </RadioGroup>


                        </AccordionDetails>
                    </StyledAccordion>
                    <StyledAccordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Nodes filtering</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                        </AccordionDetails>
                    </StyledAccordion>

                </Grid>
                <Grid item xs={9}>
                    <dharpa-network-force width="600" height="400" ref={graphRef} />

                </Grid>
                <div>
                    <span>[network analysis data vis placeholder]</span>

                    <Button onClick={() => setIsDisplayIsolated(!isDisplayIsolated)}>toggle isolated</Button>
                </div>
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
