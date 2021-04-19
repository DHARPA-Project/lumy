import React from 'react'

import InfoOutlineIcon from '@material-ui/icons/InfoOutlined'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import ToysIcon from '@material-ui/icons/Toys'

export enum NavItemType {
  'heading',
  'divider',
  'pageLink',
  'projectLink',
  'group'
}

export const pageRoutes = [
  {
    type: NavItemType.divider
  },
  {
    type: NavItemType.heading,
    label: 'pages'
  },
  {
    type: NavItemType.pageLink,
    label: 'introduction',
    link: '/intro',
    icon: <InfoOutlineIcon />,
    nested: false
  },
  {
    type: NavItemType.pageLink,
    label: 'toy VRE',
    link: '/toy',
    icon: <ToysIcon />,
    nested: false
  },
  {
    type: NavItemType.group,
    label: 'workflows',
    link: '/workflows',
    icon: <AccountTreeIcon />,
    sublist: [
      {
        type: 'link',
        label: 'topic modelling',
        link: '/workflows/topic-modelling',
        nested: true
      },
      {
        type: 'link',
        label: 'network analysis',
        link: '/workflows/network-analysis',
        nested: true
      },
      {
        type: 'link',
        label: 'geolocation',
        link: '/workflows/geolocation',
        nested: true
      }
    ]
  },
  {
    type: NavItemType.divider
  },
  {
    type: NavItemType.heading,
    label: 'projects'
  }
]
