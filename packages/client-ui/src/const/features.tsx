import React from 'react'
import { useIntl, IntlShape } from '@lumy/i18n'

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

const getFeatureLabel = (intl: IntlShape, featureId: string, idPrefix: string): string =>
  intl.formatMessage({ id: `${idPrefix}.${featureId}.label` })
const getFeatureTooltip = (intl: IntlShape, featureId: string, idPrefix: string): string =>
  intl.formatMessage({ id: `${idPrefix}.${featureId}.tooltip` })

const getFeatureList = (intl: IntlShape, idPrefix = 'app.features'): IFeature[] => [
  {
    id: featureIds.note,
    label: getFeatureLabel(intl, 'notes', idPrefix),
    tooltip: getFeatureTooltip(intl, 'notes', idPrefix),
    icon: <CreateIcon />,
    content: <NoteEditor />
  },
  {
    id: featureIds.data,
    label: getFeatureLabel(intl, 'data', idPrefix),
    tooltip: getFeatureTooltip(intl, 'data', idPrefix),
    icon: <TableChartIcon />,
    content: <DataPreview />
  },
  {
    id: featureIds.code,
    label: getFeatureLabel(intl, 'code', idPrefix),
    tooltip: getFeatureTooltip(intl, 'code', idPrefix),
    icon: <CodeIcon />,
    content: <CodeView />
  },
  {
    id: featureIds.documentation,
    label: getFeatureLabel(intl, 'documentation', idPrefix),
    tooltip: getFeatureTooltip(intl, 'documentation', idPrefix),
    icon: <LibraryBooksIcon />,
    content: null
  }
]

export const useAppFeatures = (): IFeature[] => {
  const intl = useIntl()
  return getFeatureList(intl)
}
