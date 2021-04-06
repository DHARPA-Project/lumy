import React from 'react'
import { State, useLastError, useProcessingState } from '@dharpa-vre/client-core'

export const StatusView = (): JSX.Element => {
  const [lastError] = useLastError()
  const [state] = useProcessingState()

  if (state === State.Busy) return <b>Busy...</b>

  if (lastError != null)
    return (
      <b>
        Last error ({lastError.id}): {lastError.message}
      </b>
    )
  return <></>
}
