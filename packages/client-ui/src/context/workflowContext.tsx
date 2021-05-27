import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { StepDesc } from '@dharpa-vre/client-core/src/common/types/kiaraGenerated'

export type WorkflowType = {
  isRightSideBarVisible: boolean
  setIsRightSideBarVisible: Dispatch<SetStateAction<boolean>>
  isSideDrawerOpen: boolean
  setIsSideDrawerOpen: Dispatch<SetStateAction<boolean>>
  sideDrawerTabIndex: number
  setSideDrawerTabIndex: Dispatch<SetStateAction<number>>
  projectSteps: StepDesc[]
  activeStep: number
  direction: number
  setActiveStep: Dispatch<SetStateAction<[number, number]>>
}

type WorkflowProviderProps = {
  children?: React.ReactNode
}

export const WorkflowContext = createContext<WorkflowType>(null)

const WorkflowContextProvider = ({ children }: WorkflowProviderProps): JSX.Element => {
  const [currentWorkflow] = useCurrentWorkflow()

  const [isRightSideBarVisible, setIsRightSideBarVisible] = useState(true)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [sideDrawerTabIndex, setSideDrawerTabIndex] = useState(0)
  const [[activeStep, direction], setActiveStep] = useState([0, 0])

  const projectSteps: StepDesc[] = Object.values(currentWorkflow?.steps || {}) || []

  return (
    <WorkflowContext.Provider
      value={{
        isRightSideBarVisible,
        setIsRightSideBarVisible,
        isSideDrawerOpen,
        setIsSideDrawerOpen,
        sideDrawerTabIndex,
        setSideDrawerTabIndex,
        projectSteps,
        activeStep,
        direction,
        setActiveStep
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export default WorkflowContextProvider
