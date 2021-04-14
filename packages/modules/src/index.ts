import React from 'react'
import { SimpleModuleViewProvider } from '@dharpa-vre/client-core'
const Default = React.lazy(() => import('./Default'))

const modules = [
  'twoArgsMathFunction',
  'simplePlot',
  'dataUpload',
  'dataSelection',
  'networkAnalysisDataMapping',
  'networkAnalysisDataVis'
]

export const viewProvider = new SimpleModuleViewProvider(
  modules.reduce(
    (acc, moduleId) => ({
      ...acc,
      [moduleId]: React.lazy(() => import(`./${moduleId}`))
    }),
    {} as { [key: string]: ReturnType<typeof React.lazy> }
  ),
  Default
)
