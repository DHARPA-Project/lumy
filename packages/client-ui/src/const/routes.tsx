import React from 'react'
import { useIntl, IntlShape } from 'react-intl'

// import InfoOutlineIcon from '@material-ui/icons/InfoOutlined'
// import AccountTreeIcon from '@material-ui/icons/AccountTree'
// import ToysIcon from '@material-ui/icons/Toys'
import HomeIcon from '@material-ui/icons/Home'
import BubbleChartIcon from '@material-ui/icons/BubbleChart'
import StorageIcon from '@material-ui/icons/Storage'

export enum NavItemType {
  'heading',
  'divider',
  'pageLink',
  'projectLink',
  'group'
}

interface RouteItem {
  type: NavItemType
  label: string
  link?: string
  icon?: JSX.Element
  nested?: boolean
}

const getRouteLabel = (intl: IntlShape, routeId: string, idPrefix: string): string =>
  intl.formatMessage({ id: `${idPrefix}.${routeId}.label` })

export const getPageRoutes = (intl: IntlShape, idPrefix = 'app.routes'): RouteItem[] => [
  // {
  //   type: NavItemType.divider
  // },
  {
    type: NavItemType.heading,
    label: getRouteLabel(intl, 'pages', idPrefix)
  },
  {
    type: NavItemType.pageLink,
    label: getRouteLabel(intl, 'home', idPrefix),
    link: '/home',
    icon: <HomeIcon />,
    nested: false
  },
  {
    type: NavItemType.pageLink,
    label: getRouteLabel(intl, 'dataRegistry', idPrefix),
    link: '/dataregistry',
    icon: <StorageIcon />,
    nested: false
  },
  {
    type: NavItemType.pageLink,
    label: getRouteLabel(intl, 'networkAnalysis', idPrefix),
    link: '/workflows/network-analysis',
    icon: <BubbleChartIcon />,
    nested: false
  },
  // {
  //   type: NavItemType.pageLink,
  //   label: 'introduction',
  //   link: '/intro',
  //   icon: <InfoOutlineIcon />,
  //   nested: false
  // },
  // {
  //   type: NavItemType.pageLink,
  //   label: 'toy VRE',
  //   link: '/toy',
  //   icon: <ToysIcon />,
  //   nested: false
  // },
  // {
  //   type: NavItemType.pageLink,
  //   label: 'lab',
  //   link: '/lab',
  //   icon: <BubbleChartIcon />,
  //   nested: false
  // },
  // {
  //   type: NavItemType.group,
  //   label: 'workflows',
  //   link: '/workflows',
  //   icon: <AccountTreeIcon />,
  //   sublist: [
  //     {
  //       type: 'link',
  //       label: 'topic modelling',
  //       link: '/workflows/topic-modelling',
  //       nested: true
  //     },
  //     {
  //       type: 'link',
  //       label: 'network analysis',
  //       link: '/workflows/network-analysis',
  //       nested: true
  //     },
  //     {
  //       type: 'link',
  //       label: 'geolocation',
  //       link: '/workflows/geolocation',
  //       nested: true
  //     }
  //   ]
  // },
  // {
  //   type: NavItemType.divider
  // },
  {
    type: NavItemType.heading,
    label: getRouteLabel(intl, 'projects', idPrefix)
  }
]

export const usePageRoutes = (): RouteItem[] => {
  const intl = useIntl()
  return getPageRoutes(intl)
}
