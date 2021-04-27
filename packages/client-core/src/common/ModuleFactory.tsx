import React, { useContext, Suspense } from 'react'
import { BackEndContext } from './context'
import { ModuleProps } from './modules'

export type Props = ModuleProps<unknown, unknown>

export const ModuleViewFactory = (props: Props): JSX.Element => {
  const context = useContext(BackEndContext)
  const provider = context.moduleViewProvider

  const View = provider.getModulePanel(props.step.moduleType)

  return (
    <Suspense fallback={<pre>...</pre>}>
      <View {...props} />
    </Suspense>
  )
}
