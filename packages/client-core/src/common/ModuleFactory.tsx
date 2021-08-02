import React, { useContext, Suspense } from 'react'
import { BackEndContext } from './context'
import { ModuleProps } from './modules'

export type Props = ModuleProps

export const ModuleViewFactory = (props: Props): JSX.Element => {
  const context = useContext(BackEndContext)
  const provider = context.moduleViewProvider
  const [View, setView] = React.useState<React.FC<ModuleProps>>(undefined)

  React.useEffect(() => {
    provider.getModulePanel(props.pageDetails.component).then(v => setView(() => v))
  }, [])

  if (View == null) return <pre>...</pre>

  return (
    <Suspense fallback={<pre>...</pre>}>
      <View {...props} />
    </Suspense>
  )
}
