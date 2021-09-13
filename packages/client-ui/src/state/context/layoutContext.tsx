import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

export type AppLayoutContextType = {
  isLeftSideBarExpanded: boolean
  setIsLeftSideBarExpanded: Dispatch<SetStateAction<boolean>>
}

export const LayoutContext = createContext<AppLayoutContextType>(null)

export const LayoutProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [isLeftSideBarExpanded, setIsLeftSideBarExpanded] = useState(false)

  const layoutContextValue = {
    isLeftSideBarExpanded,
    setIsLeftSideBarExpanded
  }

  return <LayoutContext.Provider value={layoutContextValue}>{children}</LayoutContext.Provider>
}
