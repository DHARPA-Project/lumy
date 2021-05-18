import React from 'react'

export interface FinishMessage {
  text: string
  type: 'ok' | 'error'
}

type Listener<T> = (value: T) => void
type UnsubscribeFn = () => void

export interface ISplashScreenContext {
  onStreamItemsUpdated: (type: 'default' | 'error', callback: Listener<string[]>) => UnsubscribeFn
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

export const useStream = (type: 'default' | 'error'): string[] => {
  const [items, setItems] = React.useState([])
  const context = React.useContext(SplashScreenContext)

  React.useEffect(() => context.onStreamItemsUpdated(type, setItems), [])
  return items
}
