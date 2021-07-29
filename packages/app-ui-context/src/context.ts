import { createContext } from 'react'

const LumyUiContext = createContext<void>(undefined)
LumyUiContext.displayName = 'LumyUiContext'

export const LumyUiContextProvider = LumyUiContext.Provider
