import React, { Dispatch, SetStateAction } from 'react'

import { LumyWorkflow, WorkflowPageDetails } from '@dharpa-vre/client-core'

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
  direction: number
  setCurrentPageIndexAndDirection: Dispatch<SetStateAction<[number, number]>>
  mainPaneWidth: number
  setMainPaneWidth: Dispatch<SetStateAction<number>>
  mainPaneHeight: number
  setMainPaneHeight: Dispatch<SetStateAction<number>>
  isAdditionalPaneVisible: boolean
  setIsAdditionalPaneVisible: Dispatch<SetStateAction<boolean>>
  workflowCode: Record<string, unknown>
  stepContainerRef: React.MutableRefObject<HTMLDivElement>
  mainPaneRef: React.MutableRefObject<HTMLDivElement>
  additionalPaneRef: React.MutableRefObject<HTMLDivElement>
  splitDirection: screenSplitDirectionType
  setSplitDirection: React.Dispatch<React.SetStateAction<screenSplitDirectionType>>
  screenSplitOptions: screenSplitOption[]
  proceedToNextStep: () => void
  returnToPreviousStep: () => void
  onMouseDown: (event: React.MouseEvent) => void
  closeAdditionalPane: () => void
  openFeatureTab: (tabIndex: number) => void
}

export type WorkflowProviderProps = {
  children?: React.ReactNode
}

export type screenSplitDirectionType = 'horizontal' | 'vertical'

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
  mainPaneHeight: number
  mainPaneWidth: number
}