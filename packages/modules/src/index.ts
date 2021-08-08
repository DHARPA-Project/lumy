import React from 'react'
import { lumyComponent } from './lumyComponent'

const modules = [
  'twoArgsMathFunction',
  'simplePlot',
  'dataUpload',
  'dataSelection',
  'networkAnalysisDataMapping',
  'networkAnalysisDataVis'
]

function registerModules(): void {
  modules.forEach(moduleId => lumyComponent(moduleId)(React.lazy(() => import(`./${moduleId}`))))
}

registerModules()

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@lumy/module-sandbox').sandbox()
}
