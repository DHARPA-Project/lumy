import React from 'react'
import { ModuleProps } from '@dharpa-vre/client-core'

const Default = ({ pageDetails }: ModuleProps): JSX.Element => {
  return (
    <div>
      <h3>Default module view for workflow step with component &quot;{pageDetails.component.id}&quot;</h3>
      <pre>{JSON.stringify(pageDetails, null, 2)}</pre>
    </div>
  )
}

export default Default
