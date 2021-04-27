import React from 'react'
import { ModuleProps, useStepInputValue } from '@dharpa-vre/client-core'

interface InputValues {
  x?: number | number[]
  y?: number | number[]
}

type Props = ModuleProps<InputValues, unknown>

const SimplePlot = ({ step }: Props): JSX.Element => {
  const [x] = useStepInputValue<number>(step.stepId, 'x')
  const [y] = useStepInputValue<number>(step.stepId, 'y')

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
