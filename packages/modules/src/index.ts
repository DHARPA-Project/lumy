import React from 'react'
import { registerLumyComponent } from '@dharpa-vre/client-core'

const modules = [
  'twoArgsMathFunction',
  'simplePlot',
  'dataUpload',
  'dataSelection',
  'networkAnalysisDataMapping',
  'networkAnalysisDataVis'
]

function registerModules(): void {
  modules.forEach(moduleId => {
    registerLumyComponent(
      moduleId,
      React.lazy(() => import(`./${moduleId}`))
    )
  })
}

registerModules()
