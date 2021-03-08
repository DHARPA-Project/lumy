import React, { useContext } from 'react'
import { ModuleProps, ParametersBase } from './modules'
import { BackEndContext } from './modelContext'

export const ModuleViewFactory = (props: ModuleProps<ParametersBase>): JSX.Element => {
  const context = useContext(BackEndContext)
  const provider = context.moduleViewProvider

  const View = provider.getModulePanel(props.step.moduleId)

  return <View {...props} />
}
