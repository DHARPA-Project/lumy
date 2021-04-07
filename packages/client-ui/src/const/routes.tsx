import React from 'react'

import InfoOutlineIcon from '@material-ui/icons/InfoOutlined'
import SettingsIcon from '@material-ui/icons/Settings'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone'
import AcUnitIcon from '@material-ui/icons/AcUnit'
import AllInclusiveIcon from '@material-ui/icons/AllInclusive'

export enum NavItemType {
  'heading',
  'divider',
  'link',
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
    type: NavItemType.link,
    label: 'introduction',
    link: '/intro',
    icon: <InfoOutlineIcon />,
    nested: false
  },
  {
    type: NavItemType.link,
    label: 'settings',
    link: '/settings',
    icon: <SettingsIcon />,
    nested: false
  },
  {
    type: NavItemType.link,
    label: 'notifications',
    link: '/notifications',
    icon: <NotificationsNoneIcon />,
    nested: false
  },
  {
    type: NavItemType.link,
    label: 'test',
    link: '/test',
    icon: <AllInclusiveIcon />,
    nested: false
  },
  {
    type: NavItemType.link,
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
  }
]
