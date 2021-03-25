import React from 'react'
import { ModuleProps, useStepTabularInputValue } from '@dharpa-vre/client-core'

interface InputValues {
  repositoryItems?: unknown
}

interface OutputValues {
  selectedItems?: unknown
}

type Props = ModuleProps<InputValues, OutputValues>

const DataSelection = ({ step }: Props): JSX.Element => {
  const [repositoryItemsPage] = useStepTabularInputValue(step.id, 'repositoryItems', 10, 0)
  console.log(repositoryItemsPage)
  return (
    <div key={step.id}>
      [placeholder for the <em>data selection</em> module]
    </div>
  )
}

export default DataSelection
