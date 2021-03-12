import { useContext, useEffect, useState } from 'react'
import { Activity } from '../common/types/messages'
import { BackEndContext, handlerAdapter, Target } from '../common/context'

export const useLastError = (): [Activity.Error] => {
  const context = useContext(BackEndContext)
  const [lastError, setLastError] = useState<Activity.Error>()

  useEffect(() => {
    const handler = handlerAdapter(Activity.codec.Error.decode, setLastError)
    context.subscribe(Target.Activity, handler)
    return () => context.unsubscribe(Target.Activity, handler)
  }, [])

  return [lastError]
}
