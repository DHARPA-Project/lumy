import React, { Dispatch, SetStateAction } from 'react'

import { LumyWorkflow, WorkflowPageDetails } from '@lumy/client-core'

export type WorkflowType = {
  isRightSideBarVisible: boolean
  setIsRightSideBarVisible: Dispatch<SetStateAction<boolean>>
  isSideDrawerOpen: boolean
  setIsSideDrawerOpen: Dispatch<SetStateAction<boolean>>
  featureTabIndex: number
  setFeatureTabIndex: Dispatch<SetStateAction<number>>
  workflowMeta: LumyWorkflow['meta']
  workflowPages: WorkflowPageDetails[]
  currentPageIndex: number
  currentPageDetails?: WorkflowPageDetails
  currentPageId?: WorkflowPageDetails['id']
  setCurrentPageId: (id: WorkflowPageDetails['id']) => void
  direction: number
  setCurrentPageIndexAndDirection: Dispatch<SetStateAction<[number, number]>>
  isAdditionalPaneVisible: boolean
  setIsAdditionalPaneVisible: Dispatch<SetStateAction<boolean>>
  workflowCode: Record<string, unknown>
  samplePythonCodeSnippet: string
  stepContainerRef: React.MutableRefObject<HTMLDivElement>
  splitDirection: screenSplitDirectionType
  setSplitDirection: React.Dispatch<React.SetStateAction<screenSplitDirectionType>>
  screenSplitOptions: screenSplitOption[]
  proceedToNextStep: () => void
  returnToPreviousStep: () => void
  closeAdditionalPane: () => void
  openFeatureTab: (tabIndex: number) => void
}

export type WorkflowProviderProps = {
  children?: React.ReactNode
}

export type screenSplitDirectionType = 'row' | 'column'

export type screenSplitOption = {
  name: screenSplitDirectionType
  icon: JSX.Element
  tooltipText: string
  direction: string
}

export interface IWorkflowLayout {
  isRightSideBarVisible: boolean
  isSideDrawerOpen: boolean
  featureTabIndex: number
  currentPageIndex: number
  direction: number
  isAdditionalPaneVisible: boolean
}
