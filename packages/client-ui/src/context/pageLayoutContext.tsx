import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

export type PageLayoutType = {
  isLeftSideBarExpanded: boolean
  setIsLeftSideBarExpanded: Dispatch<SetStateAction<boolean>>
}

type PageLayoutProviderProps = {
  children?: React.ReactNode
}

export const PageLayoutContext = createContext<PageLayoutType>(null)

const PageLayoutContextProvider = ({ children }: PageLayoutProviderProps): JSX.Element => {
  const [isLeftSideBarExpanded, setIsLeftSideBarExpanded] = useState(false)

  return (
    <PageLayoutContext.Provider
      value={{
        isLeftSideBarExpanded,
        setIsLeftSideBarExpanded
      }}
    >
      {children}
    </PageLayoutContext.Provider>
  )
}

export default PageLayoutContextProvider
