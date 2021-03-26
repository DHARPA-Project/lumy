import React from 'react'
import { useLastError } from '@dharpa-vre/client-core'

export const StatusView = (): JSX.Element => {
  const [lastError] = useLastError()
  if (lastError != null)
    return (
      <b>
        Last error ({lastError.id}): {lastError.message}
      </b>
    )
  return <></>
}
