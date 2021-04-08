import React from 'react'

import InfoOutlineIcon from '@material-ui/icons/InfoOutlined'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'
import ToysIcon from '@material-ui/icons/Toys'

export enum NavItemType {
  'heading',
  'divider',
  'pageLink',
  'projectLink',
  'group'
}

export default [
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
    label: 'settings',
    link: '/settings',
    icon: <SettingsIcon />,
    nested: false
  },
  {
    type: NavItemType.pageLink,
    label: 'notifications',
    link: '/notifications',
    icon: <NotificationsNoneIcon />,
    nested: false
  },
  {
    type: NavItemType.pageLink,
    label: 'test',
    link: '/test',
    icon: <AllInclusiveIcon />,
    nested: false
  },
  {
    type: NavItemType.pageLink,
    label: 'sample',
    link: '/sample',
    icon: <AcUnitIcon />,
    nested: false
  },
  {
    type: NavItemType.divider
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
  },
  {
    type: NavItemType.projectLink,
    label: 'Trump Tweet Network complete',
    link: '/projects/123c',
    currentStep: 5,
    totalSteps: 6
  },
  {
    type: NavItemType.projectLink,
    label: 'Trump Tweet Network partial',
    link: '/projects/123p',
    currentStep: 2,
    totalSteps: 6
  },
  {
    type: NavItemType.projectLink,
    label: 'Trump Tweet Topics',
    link: '/projects/456',
    currentStep: 9,
    totalSteps: 10
  },
  {
    type: NavItemType.divider
  },
  {
    type: NavItemType.pageLink,
    label: 'toy VRE',
    link: '/toy',
    icon: <ToysIcon />,
    nested: false
  }
]
