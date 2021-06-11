import React from 'react'

import CreateIcon from '@material-ui/icons/Create'
import CodeIcon from '@material-ui/icons/Code'
import TableChartIcon from '@material-ui/icons/TableChart'

import NoteEditor from '../components/common/NoteEditor'
import CodeView from '../components/common/CodeView'
import DataPreview from '../components/common/DataPreview'

export interface IFeature {
  id: string
  label: string
  tooltip: string
  icon: JSX.Element
  content: JSX.Element
}

export const featureList: IFeature[] = [
  {
    id: 'code',
    label: 'Code',
    tooltip: 'View Code',
    icon: <CodeIcon />,
    content: <CodeView />
  },
  {
    id: 'data',
    label: 'Data',
    tooltip: 'View Data',
    icon: <TableChartIcon />,
    content: <DataPreview />
  },
  {
    id: 'notes',
    label: 'Notes',
    tooltip: 'Check Notes',
    icon: <CreateIcon />,
    content: <NoteEditor />
  }
]
