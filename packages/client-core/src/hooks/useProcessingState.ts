import { useContext, useEffect, useState } from 'react'
import { Activity } from '../common/types/messages'
import { BackEndContext, handlerAdapter, Target } from '../common/context'

type State = Activity.ExecutionState['state']

export const useProcessingState = (): [State] => {
  const context = useContext(BackEndContext)
  const [currentState, setCurrentState] = useState<State>()

  useEffect(() => {
    const handler = handlerAdapter(Activity.codec.ExecutionState.decode, msg => setCurrentState(msg.state))
    context.subscribe(Target.Activity, handler)
    return () => context.unsubscribe(Target.Activity, handler)
  }, [])

  return [currentState]
}
