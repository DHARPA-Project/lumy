import React, { createContext, useEffect, useRef, useState } from 'react'

import { useCurrentWorkflow, WorkflowPageDetails } from '@dharpa-vre/client-core'

import sampleJupyterNotebook from '../../data/notebook.ipynb'
import { WorkflowType, WorkflowProviderProps, screenSplitDirectionType } from './workflowContext.types'
import { screenSplitOptions } from './workflowContext.const'

export const WorkflowContext = createContext<WorkflowType>(null)

export const WorkflowProvider = ({ children }: WorkflowProviderProps): JSX.Element => {
  const [currentWorkflow] = useCurrentWorkflow()

  const [isRightSideBarVisible, setIsRightSideBarVisible] = useState(false)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [featureTabIndex, setFeatureTabIndex] = useState(0)
  const [[currentPageIndex, direction], setCurrentPageIndexAndDirection] = useState([0, 0])
  const [isAdditionalPaneVisible, setIsAdditionalPaneVisible] = useState<boolean>(false)
  const [mainPaneHeight, setMainPaneHeight] = useState<number | null>(null)
  const [mainPaneWidth, setMainPaneWidth] = useState<number | null>(null)

  const workflowMeta = currentWorkflow?.meta
  const workflowPages: WorkflowPageDetails[] = currentWorkflow?.ui?.pages ?? []
  const currentPageDetails = workflowPages[currentPageIndex]

  const workflowCode = JSON.parse(sampleJupyterNotebook)

  const stepContainerRef = useRef<HTMLDivElement>(null)
  const mainPaneRef = useRef<HTMLDivElement>(null)
  const additionalPaneRef = useRef<HTMLDivElement>(null)
  const dividerPosition = useRef<{ x?: number; y?: number }>(null)

  const [splitDirection, setSplitDirection] = useState<screenSplitDirectionType>('horizontal')

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', (onMouseMove as unknown) as EventListener)

    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', (onMouseMove as unknown) as EventListener)
    }
  }, [splitDirection])

  useEffect(() => {
    if (!isAdditionalPaneVisible) return

    if (splitDirection === 'horizontal') {
      setMainPaneWidth(getStepContainerWidth() / 2)
      setMainPaneHeight(null)
    } else if (splitDirection === 'vertical') {
      setMainPaneWidth(null)
      setMainPaneHeight(getStepContainerHeight() / 2)
    }
  }, [splitDirection])

  useEffect(() => {
    if (!mainPaneRef.current) return

    if (mainPaneWidth == null || typeof mainPaneWidth !== 'number') {
      mainPaneRef.current.style.minWidth = '100%'
      mainPaneRef.current.style.maxWidth = '100%'
    }

    mainPaneRef.current.style.minWidth = mainPaneWidth + 'px'
    mainPaneRef.current.style.maxWidth = mainPaneWidth + 'px'
  }, [mainPaneWidth, mainPaneRef.current])

  useEffect(() => {
    if (!mainPaneRef.current) return

    if (mainPaneHeight == null || typeof mainPaneHeight !== 'number') {
      mainPaneRef.current.style.minHeight = '100%'
      mainPaneRef.current.style.maxHeight = '100%'
    }

    mainPaneRef.current.style.minHeight = mainPaneHeight + 'px'
    mainPaneRef.current.style.maxHeight = mainPaneHeight + 'px'
  }, [mainPaneHeight, mainPaneRef.current])

  const getStepContainerWidth = () => stepContainerRef.current?.getBoundingClientRect()?.width
  const getStepContainerHeight = () => stepContainerRef.current?.getBoundingClientRect()?.height

  const onMouseDown = (event: React.MouseEvent): void => {
    dividerPosition.current = { x: event.clientX, y: event.clientY }
  }

  const onMouseUp = (): void => {
    dividerPosition.current = null
  }

  const onMouseMove = (event: React.MouseEvent): void => {
    if (!dividerPosition.current) return

    if (splitDirection === 'horizontal') {
      setMainPaneWidth(prevWidth => {
        const newWidth = prevWidth + event.clientX - dividerPosition.current.x
        const stepContainerWidth = getStepContainerWidth()
        return newWidth <= 0.65 * stepContainerWidth && newWidth >= 0.35 * stepContainerWidth
          ? newWidth
          : prevWidth
      })
      dividerPosition.current = { x: event.clientX }
    } else if (splitDirection === 'vertical') {
      setMainPaneHeight(prevHeight => {
        const newHeight = prevHeight + event.clientY - dividerPosition.current.y
        const stepContainerHeight = getStepContainerHeight()
        return newHeight <= 0.65 * stepContainerHeight && newHeight >= 0.35 * stepContainerHeight
          ? newHeight
          : prevHeight
      })
      dividerPosition.current = { y: event.clientY }
    }
  }

  /**
   * Open the additional pane to expose key features (e.g. code view, data preview, notes)
   * @param tabIndex The index of the tab that must be active/visible when opening the feature pane
   */
  const openFeatureTab = (tabIndex: number): void => {
    setFeatureTabIndex(tabIndex)

    if (isAdditionalPaneVisible) return

    if (splitDirection === 'vertical') {
      setMainPaneHeight(getStepContainerHeight() / 2)
    } else {
      setMainPaneWidth(getStepContainerWidth() / 2)
    }

    setIsAdditionalPaneVisible(true)
  }

  const closeAdditionalPane = () => {
    setIsAdditionalPaneVisible(false)
    setMainPaneWidth(getStepContainerWidth())
    setMainPaneHeight(getStepContainerHeight())
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
        mainPaneWidth,
        setMainPaneWidth,
        mainPaneHeight,
        setMainPaneHeight,
        isAdditionalPaneVisible,
        setIsAdditionalPaneVisible,
        workflowCode,
        stepContainerRef,
        mainPaneRef,
        additionalPaneRef,
        splitDirection,
        setSplitDirection,
        screenSplitOptions,
        proceedToNextStep,
        returnToPreviousStep,
        onMouseDown,
        closeAdditionalPane,
        openFeatureTab
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}
