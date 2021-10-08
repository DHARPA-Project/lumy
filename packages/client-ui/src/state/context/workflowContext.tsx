import React, { createContext, useRef, useState } from 'react'

import { useCurrentWorkflow, WorkflowPageDetails } from '@lumy/client-core'

import sampleJupyterNotebook from '../../data/notebook.ipynb'
import { samplePythonCodeSnippet } from '../../data/sampleCodeSnippet.js'
import { WorkflowType, WorkflowProviderProps, screenSplitDirectionType } from './workflowContext.types'
import { screenSplitOptions } from './workflowContext.const'

export const WorkflowContext = createContext<WorkflowType>(null)

export const WorkflowProvider = ({ children }: WorkflowProviderProps): JSX.Element => {
  const [currentWorkflow, , isWorkflowLoading] = useCurrentWorkflow()

  const [isRightSideBarVisible, setIsRightSideBarVisible] = useState(false)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [featureTabIndex, setFeatureTabIndex] = useState(0)
  const [[currentPageIndex, direction], setCurrentPageIndexAndDirection] = useState([0, 0])
  const [isAdditionalPaneVisible, setIsAdditionalPaneVisible] = useState<boolean>(false)

  const workflowMeta = currentWorkflow?.meta
  const workflowPages: WorkflowPageDetails[] = currentWorkflow?.ui?.pages ?? []
  const currentPageDetails = workflowPages[currentPageIndex]

  const workflowCode = JSON.parse(sampleJupyterNotebook)

  const stepContainerRef = useRef<HTMLDivElement>(null)

  const [splitDirection, setSplitDirection] = useState<screenSplitDirectionType>('row')

  /**
   * Open the additional pane to expose key features (e.g. code view, data preview, notes)
   * @param tabIndex The index of the tab that must be active/visible when opening the feature pane
   */
  const openFeatureTab = (tabIndex: number): void => {
    setFeatureTabIndex(tabIndex)

    if (!isAdditionalPaneVisible) setIsAdditionalPaneVisible(true)
  }

  const closeAdditionalPane = () => {
    setIsAdditionalPaneVisible(false)
  }

  const proceedToNextStep = () => {
    setCurrentPageIndexAndDirection(([prevPageIndex, prevDirection]) => {
      const nextPageIndex = prevPageIndex + 1
      if (nextPageIndex >= workflowPages.length) return [prevPageIndex, prevDirection]
      return [nextPageIndex, 1]
    })
  }

  const returnToPreviousStep = () => {
    setCurrentPageIndexAndDirection(([prevPageIndex, prevDirection]) => {
      const nextPageIndex = prevPageIndex - 1
      if (nextPageIndex < 0) return [prevPageIndex, prevDirection]
      return [nextPageIndex, -1]
    })
  }

  const setCurrentPageId = (id: WorkflowPageDetails['id']) => {
    const pageIds = currentWorkflow?.ui?.pages?.map(page => page.id)
    const pageIndex = pageIds?.indexOf(id)
    if (pageIndex >= 0 && pageIndex != currentPageIndex) setCurrentPageIndexAndDirection([pageIndex, 0])
  }

  // the context is not in a correct state until the workflow is loaded.
  if (isWorkflowLoading) return <></>

  return (
    <WorkflowContext.Provider
      value={{
        isRightSideBarVisible,
        setIsRightSideBarVisible,
        isSideDrawerOpen,
        setIsSideDrawerOpen,
        featureTabIndex,
        setFeatureTabIndex,
        workflowMeta,
        workflowPages,
        currentPageIndex,
        currentPageDetails,
        currentPageId: currentPageDetails?.id,
        setCurrentPageId,
        direction,
        setCurrentPageIndexAndDirection,
        isAdditionalPaneVisible,
        setIsAdditionalPaneVisible,
        workflowCode,
        samplePythonCodeSnippet,
        stepContainerRef,
        splitDirection,
        setSplitDirection,
        screenSplitOptions,
        proceedToNextStep,
        returnToPreviousStep,
        closeAdditionalPane,
        openFeatureTab
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}
