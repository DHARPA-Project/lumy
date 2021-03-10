import { useContext, useEffect, useState } from 'react'
import { BackEndContext } from '../common/context'

export const useBackendIsReady = (): boolean => {
  const context = useContext(BackEndContext)
  const [isReady, setIsReady] = useState(context.isAvailable)

  useEffect(() => {
    context.onAvailabilityChanged(setIsReady)
  }, [])

  return isReady
}
