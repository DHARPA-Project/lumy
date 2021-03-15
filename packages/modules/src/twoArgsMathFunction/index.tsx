import React from 'react'
import { ModuleProps, useStepInputValues } from '@dharpa-vre/client-core'

interface InputValues {
  function?: string
  a?: number | number[]
  b?: number | number[]
}

type Props = ModuleProps<InputValues>

const SupportedFunctions = {
  add: 'Add',
  sub: 'Subtract',
  mul: 'Multiply',
  div: 'Divide',
  pow: 'Power'
}

const TwoArgsMathFunction = ({ step }: Props): JSX.Element => {
  const { inputs } = step
  const [inputValues, setInputValues] = useStepInputValues<InputValues>(step.id)

  const [a, setA] = React.useState<string>(inputValues.a == null ? '' : String(inputValues.a))
  const [b, setB] = React.useState<string>(inputValues.b == null ? '' : String(inputValues.b))

  React.useEffect(() => {
    const updatedValues = { ...inputValues }
    const aValue = parseFloat(a)
    if (!isNaN(aValue)) updatedValues.a = aValue
    const bValue = parseFloat(a)
    if (!isNaN(bValue)) updatedValues.b = bValue

    setInputValues(updatedValues)
  }, [a, b])

  return (
    <div>
      {/* function */}
      <label>
        Choose a function:
        <select>
          {Object.entries(SupportedFunctions).map(([id, label]) => (
            <option
              key={id}
              value={id}
              selected={id === inputValues.function}
              disabled={inputs.function.connection != null}
            >
              {label}
            </option>
          ))}
        </select>
      </label>

      {/* input A */}
      <label>
        Input A:
        <input
          type="number"
          value={a}
          disabled={inputs.a.connection != null}
          onChange={e => setA(e.target.value)}
        />
      </label>

      {/* input B */}
      <label>
        Input B:
        <input
          type="number"
          value={b}
          disabled={inputs.b.connection != null}
          onChange={e => setB(e.target.value)}
        />
      </label>
    </div>
  )
}

export default TwoArgsMathFunction
