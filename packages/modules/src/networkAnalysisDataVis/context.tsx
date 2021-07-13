import React, { createContext, useEffect, useRef, useState } from 'react'

import { useStepInputValue, useStepOutputValue, WorkflowPageDetails } from '@dharpa-vre/client-core'

import { ScalingMethod, InputValues, OutputValues } from './structure'

import { NetworkForce, NodeMouseEventDetails } from '@dharpa-vre/datavis-components'
import { useBoxSize } from '../hooks/useBoxSize'
import { useElementEventCallback } from './hooks'
import {
  buildGraphEdges,
  buildGraphNodes,
  getNodeScalerParameters,
  NodeScalerParameters
} from './graphDataMethods'
import initialSettingList, { SettingItem } from './settingList'

export type NetworkGraphContextType = {
  settingList: SettingItem[]
  setSettingList: React.Dispatch<React.SetStateAction<SettingItem[]>>
  highlightedDocItem: string
  setHighlightedDocItem: React.Dispatch<React.SetStateAction<string>>
  colorCodeNodes: boolean
  graphBoxSize: DOMRect
  graphContainerRef: React.Ref<HTMLDivElement>
  graphRef: React.MutableRefObject<NetworkForce>
  graphStats: OutputValues['graphStats']
  graphTooltipInfo: NodeMouseEventDetails
  isDisplayIsolated: boolean
  isDisplayLabels: boolean
  labelNodeSizeThreshold: number
  nodeScalerParams: NodeScalerParameters
  nodeScalingMethod: ScalingMethod
  setColorCodeNodes: React.Dispatch<React.SetStateAction<boolean>>
  setIsDisplayIsolated: React.Dispatch<React.SetStateAction<boolean>>
  setIsDisplayLabels: React.Dispatch<React.SetStateAction<boolean>>
  setLabelNodeSizeThreshold: React.Dispatch<React.SetStateAction<number>>
  setNodeScalingMethod: React.Dispatch<React.SetStateAction<ScalingMethod>>
}

type NetworkGraphContextProviderProps = {
  pageDetails: WorkflowPageDetails
  children?: React.ReactNode
}

export const NetworkGraphContext = createContext<NetworkGraphContextType>(null)

const NetworkGraphContextProvider = ({
  pageDetails: { id: stepId },
  children
}: NetworkGraphContextProviderProps): JSX.Element => {
  const settingListLocalStorageKey = `lumy-${stepId}-settings`

  const [settingList, setSettingList] = useState<SettingItem[]>(() => {
    let list
    try {
      const localStorageData = window.localStorage.getItem(settingListLocalStorageKey)
      if (localStorageData != null) list = JSON.parse(localStorageData)
    } catch (error) {
      console.error('retrieving setting list from local storage failed: ', error)
    }
    return list ?? initialSettingList
  })
  const [highlightedDocItem, setHighlightedDocItem] = useState('')

  // save setting list to local storage on every state update
  useEffect(() => {
    try {
      window.localStorage.setItem(settingListLocalStorageKey, JSON.stringify(settingList))
    } catch (error) {
      console.error('saving setting list to local storage failed: ', error)
    }
  }, [settingList])

  /* Get read only module input values */
  const [nodes] = useStepInputValue<InputValues['nodes']>(stepId, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<InputValues['edges']>(stepId, 'edges', { fullValue: true })

  // nodes page + filter for table view
  // const [nodesFilter, setNodesFilter] = useState<TabularDataFilter>({ pageSize: 10 })
  // const [nodesPage, , nodesStats] = useStepInputValue<InputValues['nodes'], TableStats>(
  //   step.stepId,
  //   'nodes',
  //   nodesFilter
  // )

  /* Get input values that we can control */

  // ID of the node we will get direct neighbours for
  // TODO: replace react state variable with backend state variable when
  // reapplying force on update is sorted out
  // const [selectedNodeId, setSelectedNodeId] = useStepInputValue<InputValues['selectedNodeId']>(
  //   step.stepId,
  //   'selectedNodeId'
  // )
  const [selectedNodeId, setSelectedNodeId] = useState<InputValues['selectedNodeId']>()

  /* Get output values */
  const [graphData] = useStepOutputValue<OutputValues['graphData']>(stepId, 'graphData', {
    fullValue: true
  })

  // a list of direct connections of the `selectedNodeId` node
  const [selectedNodeDirectConnections] = useStepOutputValue(stepId, 'directConnections')
  //const [shortestPath] = useStepOutputValue<string[]>(step.stepId, 'shortestPath')
  const [graphStats] = useStepOutputValue<OutputValues['graphStats']>(stepId, 'graphStats')

  /* Graph and its container reference - for getting container size */
  const graphRef = useRef<NetworkForce>(null)
  const graphContainerRef = useRef()
  const graphBoxSize = useBoxSize(graphContainerRef)

  /* local state variables, mostly for navigation */

  const [nodeScalingMethod, setNodeScalingMethod] = useState<ScalingMethod>('degree')
  const [isDisplayLabels, setIsDisplayLabels] = useState(false)
  const [isDisplayIsolated, setIsDisplayIsolated] = useState(true)
  const [graphTooltipInfo, setGraphTooltipInfo] = useState<NodeMouseEventDetails>(null)
  const [labelNodeSizeThreshold, setLabelNodeSizeThreshold] = useState<number>(0.8)
  const [colorCodeNodes, setColorCodeNodes] = useState(true)

  /* handlers for graph node hover */
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

  useEffect(() => {
    // TODO: handle updated direct connections of currently selected node.
    console.log(`Direct connections of node ${selectedNodeId}: ${selectedNodeDirectConnections}`)
  }, [selectedNodeDirectConnections])

  /* Handle changes in nodes, edges, graph data and graph parameters:
        construct new force graph data structures and pass them to the graph
  */
  useEffect(() => {
    if (graphRef.current == null) return
    const graphNodes = buildGraphNodes(nodes, graphData, isDisplayIsolated, nodeScalingMethod)
    if (graphNodes != null) graphRef.current.nodes = graphNodes
  }, [nodes, nodeScalingMethod, graphData, graphRef.current, isDisplayIsolated])

  useEffect(() => {
    if (graphRef.current == null) return
    const graphEdges = buildGraphEdges(edges)
    if (graphEdges != null) graphRef.current.edges = graphEdges
  }, [edges, graphRef.current])

  useElementEventCallback(graphRef.current, 'node-hovered', handleGraphNodeHovered)
  useElementEventCallback(graphRef.current, 'node-mousemove', handleGraphNodeMouseMove)
  useElementEventCallback(graphRef.current, 'node-hovered-out', handleGraphNodeHoveredOut)

  /* local variables */
  const nodeScalerParams = getNodeScalerParameters(graphData, nodeScalingMethod)

  return (
    <NetworkGraphContext.Provider
      value={{
        settingList,
        setSettingList,
        highlightedDocItem,
        setHighlightedDocItem,
        colorCodeNodes,
        graphBoxSize,
        graphContainerRef,
        graphRef,
        graphStats,
        graphTooltipInfo,
        isDisplayIsolated,
        isDisplayLabels,
        labelNodeSizeThreshold,
        nodeScalerParams,
        nodeScalingMethod,
        setColorCodeNodes,
        setIsDisplayIsolated,
        setIsDisplayLabels,
        setLabelNodeSizeThreshold,
        setNodeScalingMethod
      }}
    >
      {children}
    </NetworkGraphContext.Provider>
  )
}

export default NetworkGraphContextProvider
