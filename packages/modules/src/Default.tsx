import React from 'react'
import { ModuleProps } from '@dharpa-vre/client-core'

type Props = ModuleProps<unknown, unknown>

const Default = ({ step }: Props): JSX.Element => {
  return (
    <div>
      <h3>Default module view for workflow step of type &quot;{step.moduleId}&quot;</h3>
      <pre>{JSON.stringify(step, null, 2)}</pre>
    </div>
  )
}

export default Default
