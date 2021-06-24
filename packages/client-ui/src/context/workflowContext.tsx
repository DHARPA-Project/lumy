import React, { useState, createContext, Dispatch, SetStateAction } from 'react'

import { useCurrentWorkflow, workflowUtils } from '@dharpa-vre/client-core'
import { StepDesc } from '@dharpa-vre/client-core/src/common/types/kiaraGenerated'

import sampleJupyterNotebook from '../data/notebook.ipynb'

export type WorkflowType = {
  isRightSideBarVisible: boolean
  setIsRightSideBarVisible: Dispatch<SetStateAction<boolean>>
  isSideDrawerOpen: boolean
  setIsSideDrawerOpen: Dispatch<SetStateAction<boolean>>
  featureTabIndex: number
  setFeatureTabIndex: Dispatch<SetStateAction<number>>
  projectSteps: StepDesc[]
  activeStep: number
  direction: number
  setActiveStep: Dispatch<SetStateAction<[number, number]>>
  idCurrentStep: string
  mainPaneWidth: number
  setMainPaneWidth: Dispatch<SetStateAction<number>>
  mainPaneHeight: number
  setMainPaneHeight: Dispatch<SetStateAction<number>>
  isAdditionalPaneVisible: boolean
  setIsAdditionalPaneVisible: Dispatch<SetStateAction<boolean>>
  workflowCode: Record<string, unknown>
}

type WorkflowProviderProps = {
  children?: React.ReactNode
}

export const WorkflowContext = createContext<WorkflowType>(null)

const WorkflowContextProvider = ({ children }: WorkflowProviderProps): JSX.Element => {
  const [currentWorkflow] = useCurrentWorkflow()

  const [isRightSideBarVisible, setIsRightSideBarVisible] = useState(false)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [featureTabIndex, setFeatureTabIndex] = useState(0)
  const [[activeStep, direction], setActiveStep] = useState([0, 0])
  const [isAdditionalPaneVisible, setIsAdditionalPaneVisible] = useState<boolean>(false)
  const [mainPaneHeight, setMainPaneHeight] = useState<number>(0)
  const [mainPaneWidth, setMainPaneWidth] = useState<number>(0)

  const stepIds = workflowUtils.getOrderedStepIds(currentWorkflow)
  const idCurrentStep = stepIds[activeStep]
  const projectSteps: StepDesc[] = stepIds.map(stepId => currentWorkflow?.steps?.[stepId])
  const workflowCode = JSON.parse(sampleJupyterNotebook)

  return (
    <WorkflowContext.Provider
      value={{
        isRightSideBarVisible,
        setIsRightSideBarVisible,
        isSideDrawerOpen,
        setIsSideDrawerOpen,
        featureTabIndex,
        setFeatureTabIndex,
        projectSteps,
        activeStep,
        direction,
        setActiveStep,
        idCurrentStep,
        mainPaneWidth,
        setMainPaneWidth,
        mainPaneHeight,
        setMainPaneHeight,
        isAdditionalPaneVisible,
        setIsAdditionalPaneVisible,
        workflowCode
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export default WorkflowContextProvider
