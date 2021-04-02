import React from 'react'
import { ModuleProps, useStepInputValues, withMockProcessor } from '@dharpa-vre/client-core'

interface InputValues {
  operator?: string
  a?: number
  b?: number
}

interface OutputValues {
  c?: number
}

type Props = ModuleProps<InputValues, OutputValues>

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
  const [a, setA] = React.useState<string>('')
  const [b, setB] = React.useState<string>('')
  const [operator, setOperator] = React.useState<string>('add')

  React.useEffect(() => {
    if (inputValues == null) return
    if (inputValues.a != null && String(inputValues.a) !== a) setA(String(inputValues.a))
    if (inputValues.b != null && String(inputValues.b) !== b) setB(String(inputValues.b))
    if (inputValues.operator != null && inputValues.operator !== operator) setOperator(inputValues.operator)
  }, [inputValues])

  React.useEffect(() => {
    if (inputValues == null) return
    const updatedValues = { ...inputValues, operator }
    const aValue = parseFloat(a)
    if (!isNaN(aValue)) updatedValues.a = aValue
    const bValue = parseFloat(b)
    if (!isNaN(bValue)) updatedValues.b = bValue

    setInputValues(updatedValues)
  }, [a, b, operator])

  const isConnected = (input: keyof InputValues): boolean => inputs?.[input]?.connection != null

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* operator */}
      <label>
        Choose a function:
        <select
          value={operator}
          disabled={isConnected('operator')}
          onChange={e => setOperator(e.target.value)}
        >
          {Object.entries(SupportedFunctions).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>

      {/* input A */}
      <label>
        Input A:
        <input type="number" value={a} disabled={isConnected('a')} onChange={e => setA(e.target.value)} />
        {isConnected('a') ? <em>Already connected</em> : ''}
      </label>

      {/* input B */}
      <label>
        Input B:
        <input type="number" value={b} disabled={isConnected('b')} onChange={e => setB(e.target.value)} />
        {isConnected('b') ? <em>Already connected</em> : ''}
      </label>
    </div>
  )
}

const mockProcessor = (inputValues: InputValues): OutputValues => {
  const { a = 0, b = 0, operator = 'add' } = inputValues
  let c = 0
  try {
    switch (operator) {
      case 'add':
        c = a + b
        break
      case 'sub':
        c = a - b
        break
      case 'mul':
        c = a * b
        break
      case 'div':
        c = a / b
        break
      case 'pow':
        c = a ** b
        break
    }
  } finally {
    return { c }
  }
}

export default withMockProcessor(TwoArgsMathFunction, mockProcessor)
