import React from 'react'
import { ModuleProps, ParametersBase, WorkflowStep } from '@dharpa-vre/client-core'

type Props = ModuleProps<ParametersBase>

const withoutParameters = (step: WorkflowStep) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { parameters, ...rest } = step
  return rest
}

export const Default = ({ step }: Props): JSX.Element => {
  return (
    <div>
      <h3>Default module view for workflow step of type &quot;{step.moduleId}&quot;</h3>
      <pre>{JSON.stringify(withoutParameters(step), null, 2)}</pre>
    </div>
  )
}
