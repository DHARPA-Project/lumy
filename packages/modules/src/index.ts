import React from 'react'
import { SimpleModuleViewProvider } from '@dharpa-vre/client-core'
const Default = React.lazy(() => import('./Default'))
const TwoArgsMathFunction = React.lazy(() => import('./twoArgsMathFunction'))

export const viewProvider = new SimpleModuleViewProvider(
  {
    twoArgsMathFunction: TwoArgsMathFunction
  },
  Default
)
