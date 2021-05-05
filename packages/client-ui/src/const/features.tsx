import React from 'react'

import NotificationsIcon from '@material-ui/icons/Notifications'
import CreateIcon from '@material-ui/icons/Create'
import CodeIcon from '@material-ui/icons/Code'
import VisibilityIcon from '@material-ui/icons/Visibility'

import NoteEditor from '../components/common/NoteEditor'
import CodeView from '../components/common/CodeView'
import DataTable from '../components/common/DataTable'
import NotificationList from '../components/common/NotificationList'

export interface IFeature {
  id: string
  label: string
  tooltip: string
  icon: JSX.Element
  content: JSX.Element
}

export const featureList: IFeature[] = [
  {
    id: 'notifications',
    label: 'Notifications',
    tooltip: 'Check Notifications',
    icon: <NotificationsIcon />,
    content: <NotificationList />
  },
  {
    id: 'code',
    label: 'Code',
    tooltip: 'View Code',
    icon: <CodeIcon />,
    content: <CodeView />
  },
  {
    id: 'data',
    label: 'Data Preview',
    tooltip: 'View Data',
    icon: <VisibilityIcon />,
    content: <DataTable />
  },
  {
    id: 'notes',
    label: 'Notes',
    tooltip: 'Take Notes',
    icon: <CreateIcon />,
    content: <NoteEditor />
  }
]
