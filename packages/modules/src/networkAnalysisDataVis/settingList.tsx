import React from 'react'

import NodeSize from './components/settings/subsettings/nodes/NodeSize'
import NodeLabel from './components/settings/subsettings/nodes/NodeLabel'
import NodeColor from './components/settings/subsettings/nodes/NodeColor'
import IsolatedNodes from './components/settings/subsettings/layout/IsolatedNodes'

export interface SubsettingItem {
  name: string
  important: boolean
  selected: boolean
  component: unknown
}

export interface SettingItem {
  name: string
  selected: boolean
  component: unknown
  subSettings: SubsettingItem[]
}

const settingList: SettingItem[] = [
  {
    name: 'node appearance',
    selected: false,
    component: null,
    subSettings: [
      {
        name: 'size',
        important: true,
        selected: false,
        component: <NodeSize />
      },
      {
        name: 'label',
        important: false,
        selected: false,
        component: <NodeLabel />
      },
      {
        name: 'node color',
        important: true,
        selected: false,
        component: <NodeColor />
      }
    ]
  },
  {
    name: 'edge appearance',
    selected: false,
    component: null,
    subSettings: []
  },
  {
    name: 'layout/topology/filter',
    selected: false,
    component: null,
    subSettings: [
      {
        name: 'remove isolated nodes',
        important: false,
        selected: false,
        component: <IsolatedNodes />
      }
    ]
  },
  {
    name: 'shortest path',
    selected: false,
    component: null,
    subSettings: []
  },
  {
    name: 'community detection',
    selected: false,
    component: null,
    subSettings: []
  }
]

export default settingList
