import React from 'react'
import { ModuleProps, useStepInputValue } from '@lumy/client-core'

// interface InputValues {
//   x?: number | number[]
//   y?: number | number[]
// }

const SimplePlot = ({ pageDetails: { id: stepId } }: ModuleProps): JSX.Element => {
  const [x] = useStepInputValue<number>(stepId, 'x')
  const [y] = useStepInputValue<number>(stepId, 'y')

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h6>Values below will be plotted:</h6>
      <label>
        X:
        <input type="number" value={x == null ? '' : String(x)} disabled={true} />
      </label>
      <label>
        Y:
        <input type="number" value={x == null ? '' : String(y)} disabled={true} />
      </label>
    </div>
  )
}

export default SimplePlot
