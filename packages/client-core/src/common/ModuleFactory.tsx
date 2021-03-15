import React, { useContext } from 'react'
import { BackEndContext } from './context'
import { WorkflowStep } from './types'

export interface Props {
  step: WorkflowStep
}

export const ModuleViewFactory = (props: Props): JSX.Element => {
  const context = useContext(BackEndContext)
  const provider = context.moduleViewProvider

  const View = provider.getModulePanel(props.step.moduleId)

  return <View {...props} />
}
