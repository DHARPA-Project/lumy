import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as d3 from 'd3'

type MetadataId = string

export interface NodeMetadata {
  id: MetadataId
  group: string
  scaler?: number
  label: string
  [key: string]: unknown
}

export interface EdgeMetadata {
  sourceId: MetadataId
  targetId: MetadataId
}

export interface NodeMouseEventDetails {
  nodeMetadata: NodeMetadata
  mouseCoordinates: {
    x: number
    y: number
  }
}

interface GraphNodeDatum extends d3.SimulationNodeDatum {
  metadata: NodeMetadata
}
interface GraphLinkDatum extends d3.SimulationLinkDatum<GraphNodeDatum> {
  metadata: EdgeMetadata
}

type DragEvent = d3.D3DragEvent<Element, GraphNodeDatum, GraphNodeDatum>

const colorScale = d3.scaleOrdinal(d3.schemeTableau10)

const drag = (simulation: d3.Simulation<GraphNodeDatum, GraphLinkDatum>) => {
  function dragstarted(event: DragEvent) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  function dragged(event: DragEvent) {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  function dragended(event: DragEvent) {
    if (!event.active) simulation.alphaTarget(0)
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
}

const mergeNodes = (
  currentNodes: GraphNodeDatum[],
  updatedNodesMetadata: NodeMetadata[]
): GraphNodeDatum[] => {
  return updatedNodesMetadata.map(metadata => {
    const node = currentNodes.find(n => n.metadata.id === metadata.id)
    // update existing node metadata
    if (node != null) {
      node.metadata = metadata
      return node
    }
    // create new node
    return { metadata }
  })
}

const asGraphNodes = (nodes: NodeMetadata[]): GraphNodeDatum[] => {
  return nodes?.map(node => ({ metadata: node })) ?? []
}

const mergeLinks = (
  currentLinks: GraphLinkDatum[],
  updatedEdgesMetadata: EdgeMetadata[]
): GraphLinkDatum[] => {
  return updatedEdgesMetadata.map(metadata => {
    const link = currentLinks.find(
      n => n.metadata.sourceId === metadata.sourceId && n.metadata.targetId === metadata.targetId
    )
    // update existing link metadata
    if (link != null) {
      link.metadata = metadata
      return link
    }
    // create new link
    return { metadata, source: metadata.sourceId, target: metadata.targetId }
  })
}

const asGraphLinks = (edges: EdgeMetadata[]): GraphLinkDatum[] => {
  return edges?.map(edge => ({ metadata: edge, source: edge.sourceId, target: edge.targetId })) ?? []
}

/**
 * Network analysis force graph.
 */
@customElement('network-force')
export class NetworkForce extends LitElement {
  /** Width of the SVG element */
  @property({ type: Number }) width = 600
  /** Height of the SVG element */
  @property({ type: Number }) height = 400
  /** Whether to hide or display isolated nodes. */
  @property({ type: Boolean }) displayIsolatedNodes = false
  /** If `true`, force simulation will be reapplied on update
   * even if some or all of the nodes are the same.
   */
  @property({ type: Boolean }) colorCodeNodes = false

  @property({ type: Number }) labelNodeSizeThreshold = 5
  @property({ type: Boolean }) displayLabels = false
  @property({ type: Boolean }) reapplySimulationOnUpdate = true
  // if set to false, problem with isolated nodes

  /** Nodes of the graph */
  @property({ attribute: false }) nodes: NodeMetadata[] = []
  /** Edges of the graph */
  @property({ attribute: false }) edges: EdgeMetadata[] = []
  /** A list of IDs of nodes representing the shortest path between two nodes */
  @property({ attribute: false }) shortestPath: (string | number)[] = []

  /**
   * Keeping a reference to current nodes and links.
   * Note that these objects are different from `nodes` and `edges`,
   * they are mutated by `d3.forceSimulation` functions when the
   * graph is rendered or nodes are dragged by the user. It is therefore
   * important to update these objects whenever nodes and edges change
   * instead of replacing them entirely. Otherwise the force simulation
   * will be re-executed which will make the graph jolt.
   */
  currentGraphNodes: GraphNodeDatum[] = []
  currentGraphLinks: GraphLinkDatum[] = []

  render(): unknown {
    return html`
      <style>
        .graph-node:hover {
          cursor: pointer;
        }
      </style>
      <svg>
        <g class="edges"></g>
        <g class="nodes"></g>
        <g class="texts"></g>
      </svg>
    `
  }

  updated(): void {
    const svg = d3.select(this.shadowRoot.lastElementChild)
    const viewBox = [0, 0, this.width, this.height]
    svg.attr('viewBox', viewBox.join(' '))

    // Just make sure we are not trying to render edges without nodes
    if (this.nodes.length === 0 && this.edges.length > 0) return

    this.currentGraphLinks = mergeLinks(this.currentGraphLinks, this.edges)
    this.currentGraphNodes = mergeNodes(this.currentGraphNodes, this.nodes)

    // nodes scaler
    const scaleNode = d3
      .scaleLinear(this.currentGraphNodes.map(node => node.metadata.scaler ?? 0))
      .range([5, 20])
    if (this.reapplySimulationOnUpdate) {
      this.currentGraphNodes = asGraphNodes(this.nodes)
      this.currentGraphLinks = asGraphLinks(this.edges)
    } else {
      this.currentGraphNodes = mergeNodes(this.currentGraphNodes, this.nodes)
      this.currentGraphLinks = mergeLinks(this.currentGraphLinks, this.edges)
    }

    const simulation = d3
      .forceSimulation(this.currentGraphNodes)
      .force(
        'link',
        d3.forceLink<GraphNodeDatum, GraphLinkDatum>(this.currentGraphLinks).id(d => d.metadata.id)
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      /*.force(
        'collide',
        d3.forceCollide<GraphNodeDatum>(d => scaleNode(d.metadata.scaler ?? 0) * 1.3 ?? 5)
      )*/
      .force(
        'collide',
        d3.forceCollide<GraphNodeDatum>(d => scaleNode(d.metadata.scaler ?? 0) ?? 5)
      )
      .force('x', this.displayIsolatedNodes ? null : d3.forceX())
      .force('y', this.displayIsolatedNodes ? null : d3.forceY())

    const shortestPathIsProvided = this.shortestPath?.length > 0

    const edgesGroup = svg.select('g.edges').attr('stroke', '#999').attr('stroke-opacity', 0.6)
    const nodesGroup = svg.select('g.nodes').attr('stroke', '#fff').attr('stroke-width', 1.5)
    const textsGroup = svg.select('g.texts')

    const link = edgesGroup
      .selectAll('line')
      .data(this.currentGraphLinks)
      .join('line')
      .attr('class', 'graph-links')
      .attr('stroke-width', d => {
        if (shortestPathIsProvided) {
          return this.edgeIsInShortestPath(d) ? 1 : 0.5
        }
        return 0.5
      })
      .attr('opacity', d => {
        if (shortestPathIsProvided) {
          return this.edgeIsInShortestPath(d) ? 1 : 0.2
        }
        return 1
      })

    const node = nodesGroup
      .selectAll('circle')
      .data(this.currentGraphNodes)
      .join('circle')
      .attr('class', 'graph-node')
      .attr('opacity', d => {
        if (shortestPathIsProvided) {
          return this.shortestPath.includes(d.metadata.id) ? 1 : 0.2
        }
        return 1
      })
      .attr('r', d => scaleNode(d.metadata.scaler ?? 0) ?? 5)
      .attr('fill', d => (this.colorCodeNodes ? colorScale(d.metadata.group) : '#4E79A7'))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call((drag(simulation) as unknown) as any)
      .on('mouseover', (e: MouseEvent, nodeDatum: GraphNodeDatum) => {
        const [x, y] = d3.pointer(e)
        this.dispatchEvent(
          new CustomEvent<NodeMouseEventDetails>('node-hovered', {
            detail: {
              nodeMetadata: nodeDatum.metadata,
              mouseCoordinates: { x, y }
            }
          })
        )
      })
      .on('mousemove', (e: MouseEvent, nodeDatum: GraphNodeDatum) => {
        const [x, y] = d3.pointer(e)
        this.dispatchEvent(
          new CustomEvent<NodeMouseEventDetails>('node-mousemove', {
            detail: {
              nodeMetadata: nodeDatum.metadata,
              mouseCoordinates: { x, y }
            }
          })
        )
      })
      .on('mouseout', () => {
        this.dispatchEvent(new CustomEvent('node-hovered-out'))
      })

    const texts = textsGroup
      .selectAll('.node-labels')
      .data(this.currentGraphNodes)
      .join('text')
      .attr('dx', 9)
      .attr('dy', '0.35em')
      .attr('class', 'node-labels')
      .attr('font-family', 'sans-serif')
      .style('display', d =>
        this.displayLabels ? 'none' : d.metadata.scaler > this.labelNodeSizeThreshold ? 'inline' : 'none'
      )

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNodeDatum).x)
        .attr('y1', d => (d.source as GraphNodeDatum).y)
        .attr('x2', d => (d.target as GraphNodeDatum).x)
        .attr('y2', d => (d.target as GraphNodeDatum).y)

      node.attr('cx', d => d.x ?? 0).attr('cy', d => d.y ?? 0)

      texts
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .text(d => d.metadata.label)
    })
  }

  edgeIsInShortestPath(edge: GraphLinkDatum): boolean {
    const { sourceId, targetId } = edge.metadata

    const sourceIdx = this.shortestPath.findIndex(id => sourceId === id)
    if (sourceIdx >= 0) {
      const tId = this.shortestPath[sourceIdx + 1]
      return tId === targetId
    }
    return false
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'network-force': NetworkForce
  }
  // watch development here: https://github.com/Polymer/lit-element/issues/1172
  namespace JSX {
    interface IntrinsicElements {
      'network-force': Partial<NetworkForce> & { ref?: unknown }
    }
  }
}
