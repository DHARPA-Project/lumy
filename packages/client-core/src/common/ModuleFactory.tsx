import React, { useContext, Suspense } from 'react'
import { BackEndContext } from './context'
import { ModuleProps } from './modules'

export type Props = ModuleProps

export const ModuleViewFactory = (props: Props): JSX.Element => {
  const context = useContext(BackEndContext)
  const provider = context.moduleViewProvider

  const View = provider.getModulePanel(props.pageDetails.component)

  return (
    <Suspense fallback={<pre>...</pre>}>
      <View {...props} />
    </Suspense>
  )
}
