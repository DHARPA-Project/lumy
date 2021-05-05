import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

export type PageLayoutType = {
  isLeftSideBarExpanded: boolean
  setIsLeftSideBarExpanded: Dispatch<SetStateAction<boolean>>
  isRightSideBarVisible: boolean
  setIsRightSideBarVisible: Dispatch<SetStateAction<boolean>>
  isSideDrawerOpen: boolean
  setIsSideDrawerOpen: Dispatch<SetStateAction<boolean>>
  sideDrawerTabIndex: number
  setSideDrawerTabIndex: Dispatch<SetStateAction<number>>
}

type PageLayoutProviderProps = {
  children?: React.ReactNode
}

export const PageLayoutContext = createContext<PageLayoutType>(null)

const PageLayoutContextProvider = ({ children }: PageLayoutProviderProps): JSX.Element => {
  const [isLeftSideBarExpanded, setIsLeftSideBarExpanded] = useState(false)
  const [isRightSideBarVisible, setIsRightSideBarVisible] = useState(true)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [sideDrawerTabIndex, setSideDrawerTabIndex] = useState(0)

  return (
    <PageLayoutContext.Provider
      value={{
        isLeftSideBarExpanded,
        setIsLeftSideBarExpanded,
        isRightSideBarVisible,
        setIsRightSideBarVisible,
        isSideDrawerOpen,
        setIsSideDrawerOpen,
        sideDrawerTabIndex,
        setSideDrawerTabIndex
      }}
    >
      {children}
    </PageLayoutContext.Provider>
  )
}

export default PageLayoutContextProvider
