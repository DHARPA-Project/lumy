import React from 'react'
import { SimpleModuleViewProvider } from '@dharpa-vre/client-core'
const Default = React.lazy(() => import('./Default'))
const TwoArgsMathFunction = React.lazy(() => import('./twoArgsMathFunction'))
const SimplePlot = React.lazy(() => import('./simplePlot'))

export const viewProvider = new SimpleModuleViewProvider(
  {
    twoArgsMathFunction: TwoArgsMathFunction,
    simplePlot: SimplePlot
  },
  Default
)
