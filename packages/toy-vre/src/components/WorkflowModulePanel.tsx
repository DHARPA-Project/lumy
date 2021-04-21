import React, { useState, useEffect } from 'react'
import { useStepInputValues, StepDesc } from '@dharpa-vre/client-core'

export interface WorkflowModulePanelProps {
  step: StepDesc['step']
}

type DummyInputs = { [parameterId: string]: unknown }

const toText = (v: DummyInputs) => {
  try {
    return JSON.stringify(v, null, 2)
  } catch {
    return '[cannot be stringified]'
  }
}

const fromText = (v: string) => {
  try {
    return JSON.parse(v) as DummyInputs
  } catch {
    return undefined
  }
}

export const WorkflowModulePanel = ({ step }: WorkflowModulePanelProps): JSX.Element => {
  const [parameters, updateParameters] = useStepInputValues<DummyInputs>(step.stepId)
  const [changedParametersText, setChangedParametersText] = useState<string>(toText(parameters))
  const [editingError, setEditingError] = useState<string>()

  useEffect(() => {
    setChangedParametersText(toText(parameters) ?? '')
  }, [parameters])

  const handleParametersChanged = (text: string) => {
    setChangedParametersText(text)
    const params = fromText(text)
    if (params == null) setEditingError('Malformed JSON')
    else setEditingError(undefined)
  }

  const parametersChanged = changedParametersText !== (toText(parameters) ?? '')

  return (
    <>
      <h3>
        Parameters for module &quot;{step.moduleType}&quot; ({step.stepId}):
      </h3>
      <textarea
        rows={5}
        cols={30}
        value={changedParametersText}
        onChange={event => handleParametersChanged(event.target.value)}
      />
      {editingError ? <em>{editingError}</em> : ''}
      <button
        onClick={() => updateParameters(fromText(changedParametersText))}
        disabled={!!editingError || !parametersChanged}
      >
        update parameters
      </button>
    </>
  )
}
