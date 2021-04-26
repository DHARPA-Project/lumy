import React from 'react'
import { ModuleProps, useStepInputValue, withMockProcessor } from '@dharpa-vre/client-core'
import { getStepsConnections } from '@dharpa-vre/client-core/src/common/utils/workflow'

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

const TwoArgsMathFunction = ({ step, inputConnections }: Props): JSX.Element => {
  const [a, setA] = useStepInputValue<number>(step.stepId, 'a')
  const [b, setB] = useStepInputValue<number>(step.stepId, 'b')
  const [operator = 'add', setOperator] = useStepInputValue<string>(step.stepId, 'operator')

  // const [inputValues, setInputValues] = useStepInputValues<InputValues>(step.stepId)
  const [aStr, setAStr] = React.useState<string>('')
  const [bStr, setBStr] = React.useState<string>('')
  // const [operator, setOperator] = React.useState<string>('add')

  React.useEffect(() => {
    if (a != null) setAStr(String(a))
  }, [a])
  React.useEffect(() => {
    if (b != null) setBStr(String(b))
  }, [b])

  React.useEffect(() => {
    const v = parseFloat(aStr)
    if (!isNaN(v) && v !== a) setA(v)
  }, [aStr])
  React.useEffect(() => {
    const v = parseFloat(bStr)
    if (!isNaN(v) && v !== b) setB(v)
  }, [bStr])

  const isConnected = (inputId: keyof InputValues): boolean =>
    getStepsConnections(inputConnections, inputId).length > 0

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
        <input
          type="number"
          value={aStr}
          disabled={isConnected('a')}
          onChange={e => setAStr(e.target.value)}
        />
        {isConnected('a') ? <em>Already connected</em> : ''}
      </label>

      {/* input B */}
      <label>
        Input B:
        <input
          type="number"
          value={bStr}
          disabled={isConnected('b')}
          onChange={e => setBStr(e.target.value)}
        />
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
