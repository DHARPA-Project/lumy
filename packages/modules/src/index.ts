import React from 'react'
import { registerLumyComponent } from '../../client-core/src'
// import { SimpleModuleViewProvider } from '@dharpa-vre/client-core'
// const Default = React.lazy(() => import('./Default'))

const modules = [
  'twoArgsMathFunction',
  'simplePlot',
  'dataUpload',
  'dataSelection',
  'networkAnalysisDataMapping',
  'networkAnalysisDataVis'
]

// export const viewProvider = new SimpleModuleViewProvider(
//   modules.reduce(
//     (acc, moduleId) => ({
//       ...acc,
//       [moduleId]: React.lazy(() => import(`./${moduleId}`))
//     }),
//     {} as { [key: string]: ReturnType<typeof React.lazy> }
//   ),
//   Default
// )

export function registerTestModules(): void {
  modules.forEach(moduleId => {
    registerLumyComponent(
      moduleId,
      React.lazy(() => import(`./${moduleId}`))
    )
  })
}

registerTestModules()
