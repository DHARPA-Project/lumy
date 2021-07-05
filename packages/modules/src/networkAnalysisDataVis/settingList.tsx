import React from 'react'

import NodeSize from './components/settings/subsettings/nodes/NodeSize'
import NodeLabel from './components/settings/subsettings/nodes/NodeLabel'
import NodeColor from './components/settings/subsettings/nodes/NodeColor'
import IsolatedNodes from './components/settings/subsettings/layout/IsolatedNodes'

export interface SubsettingItem {
  id: string
  name: string
  important: boolean
  selected: boolean
  component: unknown
}

export interface SettingItem {
  id: string
  name: string
  selected: boolean
  component: unknown
  children: SubsettingItem[]
}

const settingList: SettingItem[] = [
  {
    id: 'node-appearance',
    name: 'node appearance',
    selected: false,
    component: null,
    children: [
      {
        id: 'node-size',
        name: 'size',
        important: true,
        selected: false,
        component: <NodeSize />
      },
      {
        id: 'node-label',
        name: 'label',
        important: false,
        selected: false,
        component: <NodeLabel />
      },
      {
        id: 'node-color',
        name: 'node color',
        important: true,
        selected: false,
        component: <NodeColor />
      }
    ]
  },
  {
    id: 'edge-appearance',
    name: 'edge appearance',
    selected: false,
    component: null,
    children: []
  },
  {
    id: 'layout-toplogy-filter',
    name: 'layout/topology/filter',
    selected: false,
    component: null,
    children: [
      {
        id: 'remove-isolated-nodes',
        name: 'remove isolated nodes',
        important: false,
        selected: false,
        component: <IsolatedNodes />
      }
    ]
  },
  {
    id: 'shortest-path',
    name: 'shortest path',
    selected: false,
    component: null,
    children: []
  },
  {
    id: 'community-detection',
    name: 'community detection',
    selected: false,
    component: null,
    children: []
  }
]

export default settingList
