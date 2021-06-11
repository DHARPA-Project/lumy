import React from 'react'

export function useElementEventCallback<E extends Event>(
  element: Element,
  eventName: string,
  eventHandler: (e: E) => void
): void {
  React.useEffect(() => {
    element?.addEventListener(eventName, eventHandler as EventListener)
    return () => element?.removeEventListener(eventName, eventHandler as EventListener)
  }, [element])
}
