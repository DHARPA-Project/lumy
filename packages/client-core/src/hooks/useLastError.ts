import { useContext, useEffect, useState } from 'react'
import { Activity } from '../common/types/messages'
import { BackEndContext, IBackEndContext, MessageEnvelope, Target } from '../common/context'

export const useLastError = (): [Activity.Error] => {
  const context = useContext(BackEndContext)
  const [lastError, setLastError] = useState<Activity.Error>()

  useEffect(() => {
    const handler = (ctx: IBackEndContext, msg: MessageEnvelope<Activity.Error>) => {
      if (msg.action === 'error') setLastError(msg.content)
    }
    context.subscribe(Target.Activity, handler)
    return () => context.unsubscribe(Target.Activity, handler)
  }, [])

  return [lastError]
}
