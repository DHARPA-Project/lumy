import React from 'react'

import NodeSize from './components/settings/subsettings/nodes/NodeSize'
import NodeLabel from './components/settings/subsettings/nodes/NodeLabel'
import NodeColor from './components/settings/subsettings/nodes/NodeColor'
import IsolatedNodes from './components/settings/subsettings/layout/IsolatedNodes'

export interface SubsettingItem {
  id: string
  name: string
  details?: string
  important: boolean
  selected: boolean
}

export interface SettingItem {
  id: string
  name: string
  selected: boolean
  children: SubsettingItem[]
}

export const settingComponentInventory: Record<string, JSX.Element> = {
  'node-size': <NodeSize subsettingId="node-size" />,
  'node-label': <NodeLabel subsettingId="node-label" />,
  'node-color': <NodeColor subsettingId="node-color" />,
  'remove-isolated-nodes': <IsolatedNodes />
}

export const settingList: SettingItem[] = [
  {
    id: 'node-appearance',
    name: 'node appearance',
    selected: false,
    children: [
      {
        id: 'node-size',
        name: 'size',
        details: 'Node sizes can be adjusted to reflect various degrees of connectedness.',
        important: true,
        selected: false
      },
      {
        id: 'node-label',
        name: 'label',
        details: `Choose whether you'd like to display node labels.`,
        important: false,
        selected: false
      },
      {
        id: 'node-color',
        name: 'node color',
        details: 'Nodes can be colored to match the groups they belong to.',
        important: true,
        selected: false
      }
    ]
  },
  {
    id: 'edge-appearance',
    name: 'edge appearance',
    selected: false,
    children: []
  },
  {
    id: 'layout-toplogy-filter',
    name: 'layout/topology/filter',
    selected: false,
    children: [
      {
        id: 'remove-isolated-nodes',
        name: 'remove isolated nodes',
        details: 'Isolated nodes can be removed',
        important: false,
        selected: false
      }
    ]
  },
  {
    id: 'shortest-path',
    name: 'shortest path',
    selected: false,
    children: []
  },
  {
    id: 'community-detection',
    name: 'community detection',
    selected: false,
    children: []
  }
]

export default settingList
