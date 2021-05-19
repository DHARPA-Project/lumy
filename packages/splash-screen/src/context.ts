import React from 'react'

export interface FinishMessage {
  text: string
  type: 'ok' | 'error'
}

export interface StreamMessage {
  type: 'info' | 'error' | 'warn'
  text: string
}

type Listener<T> = (value: T) => void
type UnsubscribeFn = () => void

export interface ISplashScreenContext {
  onStreamItemsUpdated: (callback: Listener<StreamMessage[]>) => UnsubscribeFn
  onFinishMessageAvailable: (callback: Listener<FinishMessage>) => UnsubscribeFn
}

export const SplashScreenContext = React.createContext<ISplashScreenContext>(null)
SplashScreenContext.displayName = 'SplashScreenContext'

export const SplashScreenContextProvider = SplashScreenContext.Provider

export const useFinishMessage = (): FinishMessage | undefined => {
  const [msg, setMsg] = React.useState<FinishMessage>(undefined)
  const context = React.useContext(SplashScreenContext)
  React.useEffect(() => context.onFinishMessageAvailable(setMsg), [])

  return msg
}

export const useStream = (): StreamMessage[] => {
  const [items, setItems] = React.useState<StreamMessage[]>([])
  const context = React.useContext(SplashScreenContext)

  React.useEffect(() => context.onStreamItemsUpdated(setItems), [])
  return items
}
