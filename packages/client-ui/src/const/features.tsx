import React from 'react'

import CreateIcon from '@material-ui/icons/Create'
import CodeIcon from '@material-ui/icons/Code'
import TableChartIcon from '@material-ui/icons/TableChart'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

import NoteEditor from '../components/common/NoteEditor'
import DataPreview from '../components/common/DataPreview'
import CodeView from '../components/common/code/CodeView'

export interface IFeature {
  id: string
  label: string
  tooltip: string
  icon: JSX.Element
  content: JSX.Element
}

export const featureIds = {
  note: 'note-feature-container',
  data: 'data-view-container',
  code: 'code-view-container',
  documentation: 'documentation-container'
}

export const featureList: IFeature[] = [
  {
    id: featureIds.note,
    label: 'Notes',
    tooltip: 'Check Notes',
    icon: <CreateIcon />,
    content: <NoteEditor />
  },
  {
    id: featureIds.data,
    label: 'Data',
    tooltip: 'View Data',
    icon: <TableChartIcon />,
    content: <DataPreview />
  },
  {
    id: featureIds.code,
    label: 'Code',
    tooltip: 'View Code',
    icon: <CodeIcon />,
    content: <CodeView />
  },
  {
    id: featureIds.documentation,
    label: 'Help',
    tooltip: 'See Documentation',
    icon: <LibraryBooksIcon />,
    content: null
  }
]
