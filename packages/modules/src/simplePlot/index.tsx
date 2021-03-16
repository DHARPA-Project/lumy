import React from 'react'
import { ModuleProps, useStepInputValues } from '@dharpa-vre/client-core'

interface InputValues {
  x?: number | number[]
  y?: number | number[]
}

type Props = ModuleProps<InputValues, unknown>

const SimplePlot = ({ step }: Props): JSX.Element => {
  const [inputValues] = useStepInputValues<InputValues>(step.id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h6>Values below will be plotted:</h6>
      <label>
        X:
        <input type="number" value={String(inputValues?.x)} disabled={true} />
      </label>
      <label>
        Y:
        <input type="number" value={String(inputValues?.y)} disabled={true} />
      </label>
    </div>
  )
}

export default SimplePlot
