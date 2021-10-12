import React, { createContext, useEffect, useMemo, useRef, useState } from 'react'

import { useStepOutputValue, WorkflowPageDetails } from '@lumy/client-core'
import { NetworkForce, NodeMouseEventDetails } from '@lumy/datavis-components'

import { ScalingMethod, InputValues, OutputValues, GraphStats } from './structure'
import {
  buildGraphEdges,
  buildGraphNodes,
  getNodeScalerParameters,
  NodeScalerParameters
} from './graphDataMethods'
import initialSettingList, { SettingItem } from './settingList'

export type NetworkGraphContextType = {
  colorCodeNodes: boolean
  graphRef: React.MutableRefObject<NetworkForce>
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

type TooltipContextType = {
  graphTooltipInfo: NodeMouseEventDetails
  nodeScalingMethod: ScalingMethod
}

type StatisticsContextType = {
  graphStats: Partial<GraphStats>
}

type SettingContextType = {
  settingList: SettingItem[]
  setSettingList: React.Dispatch<React.SetStateAction<SettingItem[]>>
  highlightedDocItem: string
  setHighlightedDocItem: React.Dispatch<React.SetStateAction<string>>
}

type NetworkGraphContextProviderProps = {
  pageDetails: WorkflowPageDetails
  children?: React.ReactNode
}

export const NetworkGraphContext = createContext<NetworkGraphContextType>(null)
export const TooltipContext = createContext<TooltipContextType>(null)
export const StatisticsContext = createContext<StatisticsContextType>(null)
export const SettingContext = createContext<SettingContextType>(null)

const useGraphStats = (stepId: string): Partial<GraphStats> => {
  const [nodesCount] = useStepOutputValue<GraphStats['nodesCount']>(stepId, 'nodesCount')
  const [edgesCount] = useStepOutputValue<GraphStats['edgesCount']>(stepId, 'edgesCount')
  const [density] = useStepOutputValue<GraphStats['density']>(stepId, 'density')
  const [averageShortestPathLength] = useStepOutputValue<GraphStats['averageShortestPathLength']>(
    stepId,
    'averageShortestPathLength'
  )
  const [averageDegree] = useStepOutputValue<GraphStats['averageDegree']>(stepId, 'averageDegree')
  const [averageInDegree] = useStepOutputValue<GraphStats['averageInDegree']>(stepId, 'averageInDegree')
  const [averageOutDegree] = useStepOutputValue<GraphStats['averageOutDegree']>(stepId, 'averageOutDegree')
  const stats = React.useMemo<Partial<GraphStats>>(
    () => ({
      nodesCount,
      edgesCount,
      density,
      averageShortestPathLength,
      averageDegree,
      averageInDegree,
      averageOutDegree
    }),
    [
      nodesCount,
      edgesCount,
      density,
      averageShortestPathLength,
      averageDegree,
      averageInDegree,
      averageOutDegree
    ]
  )

  return stats
}

const NetworkGraphContextProvider = ({
  pageDetails: { id: stepId },
  children
}: NetworkGraphContextProviderProps): JSX.Element => {
  const settingListLocalStorageKey = `lumy-${stepId}-settings`

  const [settingList, setSettingList] = useState<SettingItem[]>(() => {
    let list
    // TODO: This may clash with a step of a similar name from another workflow.
    try {
      const localStorageData = window.localStorage.getItem(settingListLocalStorageKey)
      if (localStorageData != null) list = JSON.parse(localStorageData)
    } catch (error) {
      console.error('retrieving setting list from local storage failed: ', error)
    }
    return list ?? initialSettingList
  })
  const [highlightedDocItem, setHighlightedDocItem] = useState('')

  // TODO: This may clash with a step of a similar name from another workflow.
  // save setting list to local storage on every state update
  useEffect(() => {
    try {
      window.localStorage.setItem(settingListLocalStorageKey, JSON.stringify(settingList))
    } catch (error) {
      console.error('saving setting list to local storage failed: ', error)
    }
  }, [settingList])

  /* Get output values */
  const [nodes] = useStepOutputValue<OutputValues['nodes']>(stepId, 'nodes', { fullValue: true })
  const [edges] = useStepOutputValue<OutputValues['edges']>(stepId, 'edges', { fullValue: true })

  // nodes page + filter for table view
  // const [nodesFilter, setNodesFilter] = useState<TabularDataFilter>({ pageSize: 10 })
  // const [nodesPage, , nodesStats] = useStepInputValue<InputValues['nodes'], TableStats>(
  //   step.stepId,
  //   'nodes',
  //   nodesFilter
  // )

  /* Get input values that we can control */

  // ID of the node we will get direct neighbours for
  // TODO: replace react state variable with backend state variable when reapplying force on update is sorted out
  // const [selectedNodeId, setSelectedNodeId] = useStepInputValue<InputValues['selectedNodeId']>(
  //   step.stepId,
  //   'selectedNodeId'
  // )
  const [selectedNodeId, setSelectedNodeId] = useState<InputValues['selectedNodeId']>()

  // a list of direct connections of the `selectedNodeId` node
  const [selectedNodeDirectConnections] = useStepOutputValue(stepId, 'directConnections')
  //const [shortestPath] = useStepOutputValue<string[]>(step.stepId, 'shortestPath')

  const graphStats = useGraphStats(stepId)

  /* Graph and its container reference - for getting container size */
  const graphRef = useRef<NetworkForce>(null)

  /* local state variables, mostly for navigation */

  const [nodeScalingMethod, setNodeScalingMethod] = useState<ScalingMethod>('degree')
  const [isDisplayLabels, setIsDisplayLabels] = useState(false)
  const [isDisplayIsolated, setIsDisplayIsolated] = useState(true)
  const [graphTooltipInfo, setGraphTooltipInfo] = useState<NodeMouseEventDetails>(null)
  const [labelNodeSizeThreshold, setLabelNodeSizeThreshold] = useState<number>(0.8)
  const [colorCodeNodes, setColorCodeNodes] = useState(true)

  useEffect(() => {
    // TODO: handle updated direct connections of currently selected node.
    console.debug(`TODO: Direct connections of node ${selectedNodeId}: ${selectedNodeDirectConnections}`)
  }, [selectedNodeDirectConnections])

  /* Handle changes in nodes, edges, graph data and graph parameters:
        construct new force graph data structures and pass them to the graph
  */
  useEffect(() => {
    if (graphRef.current == null) return
    const graphNodes = buildGraphNodes(nodes, isDisplayIsolated, nodeScalingMethod)
    if (graphNodes != null) graphRef.current.nodes = graphNodes
  }, [nodes, nodeScalingMethod, graphRef.current, isDisplayIsolated])

  useEffect(() => {
    if (graphRef.current == null) return
    const graphEdges = buildGraphEdges(edges)
    if (graphEdges != null) graphRef.current.edges = graphEdges
  }, [edges, graphRef.current])

  React.useEffect(() => {
    const graphElement = graphRef.current

    const handleEnter = (enterEvent: CustomEvent<NodeMouseEventDetails>) => {
      const nodeId = enterEvent.detail.nodeMetadata.id
      setSelectedNodeId(nodeId)
      setGraphTooltipInfo(enterEvent.detail)
    }

    const handleMove = (moveEvent: CustomEvent<NodeMouseEventDetails>) => {
      setGraphTooltipInfo(moveEvent.detail)
    }
    const handleLeave = () => {
      setGraphTooltipInfo(undefined)
      setSelectedNodeId(null)
    }

    graphElement?.addEventListener('node-hovered', handleEnter as EventListener)
    graphElement?.addEventListener('node-mousemove', handleMove as EventListener)
    graphElement?.addEventListener('node-hovered-out', handleLeave as EventListener)

    return () => {
      graphElement?.removeEventListener('node-hovered', handleEnter as EventListener)
      graphElement?.removeEventListener('node-mousemove', handleMove as EventListener)
      graphElement?.removeEventListener('node-hovered-out', handleLeave as EventListener)
    }
  }, [graphRef])

  /* local variables */
  const nodeScalerParams = React.useMemo(() => getNodeScalerParameters(nodes, nodeScalingMethod), [
    nodes,
    nodeScalingMethod
  ])

  const statisticsContext = useMemo(
    () => ({
      graphStats
    }),
    [graphStats]
  )

  const settingContext = useMemo(
    () => ({
      settingList,
      setSettingList,
      highlightedDocItem,
      setHighlightedDocItem
    }),
    [settingList, setSettingList, highlightedDocItem, setHighlightedDocItem]
  )

  const tooltipContext = useMemo(
    () => ({
      graphTooltipInfo,
      nodeScalingMethod
    }),
    [graphTooltipInfo, nodeScalingMethod]
  )

  const networkGraphContext = useMemo(
    () => ({
      colorCodeNodes,
      graphRef,
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
    }),
    [
      colorCodeNodes,
      graphRef,
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
    ]
  )

  SettingContext
  return (
    <NetworkGraphContext.Provider value={networkGraphContext}>
      <StatisticsContext.Provider value={statisticsContext}>
        <SettingContext.Provider value={settingContext}>
          <TooltipContext.Provider value={tooltipContext}>{children}</TooltipContext.Provider>
        </SettingContext.Provider>
      </StatisticsContext.Provider>
    </NetworkGraphContext.Provider>
  )
}

export default NetworkGraphContextProvider
