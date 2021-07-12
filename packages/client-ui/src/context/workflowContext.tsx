import React, { createContext, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit'

import { LumyWorkflow, useCurrentWorkflow, WorkflowPageDetails } from '@dharpa-vre/client-core'

import sampleJupyterNotebook from '../data/notebook.ipynb'

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

type WorkflowProviderProps = {
  children?: React.ReactNode
}

export type screenSplitDirectionType = 'horizontal' | 'vertical'

type screenSplitOption = {
  name: screenSplitDirectionType
  icon: JSX.Element
  tooltipText: string
  direction: string
}

const screenSplitOptions: screenSplitOption[] = [
  {
    name: 'horizontal',
    icon: <HorizontalSplitIcon />,
    tooltipText: 'split: top / bottom',
    direction: 'vertical'
  },
  {
    name: 'vertical',
    icon: <VerticalSplitIcon />,
    tooltipText: 'split: left / right',
    direction: 'horizontal'
  }
]

export const WorkflowContext = createContext<WorkflowType>(null)

const WorkflowContextProvider = ({ children }: WorkflowProviderProps): JSX.Element => {
  const [currentWorkflow] = useCurrentWorkflow()

  const [isRightSideBarVisible, setIsRightSideBarVisible] = useState(false)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false)
  const [featureTabIndex, setFeatureTabIndex] = useState(0)
  const [[currentPageIndex, direction], setCurrentPageIndexAndDirection] = useState([0, 0])
  const [isAdditionalPaneVisible, setIsAdditionalPaneVisible] = useState<boolean>(false)
  const [mainPaneHeight, setMainPaneHeight] = useState<number>(0)
  const [mainPaneWidth, setMainPaneWidth] = useState<number>(0)

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
      setMainPaneHeight(getStepContainerHeight())
    } else if (splitDirection === 'vertical') {
      setMainPaneWidth(getStepContainerWidth())
      setMainPaneHeight(getStepContainerHeight() / 2)
    }
  }, [splitDirection])

  useEffect(() => {
    if (!mainPaneWidth) return

    mainPaneRef.current.style.minWidth = mainPaneWidth + 'px'
    mainPaneRef.current.style.maxWidth = mainPaneWidth + 'px'
  }, [mainPaneWidth])

  useEffect(() => {
    if (!mainPaneHeight) return

    mainPaneRef.current.style.minHeight = mainPaneHeight + 'px'
    mainPaneRef.current.style.maxHeight = mainPaneHeight + 'px'
  }, [mainPaneHeight])

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

export default WorkflowContextProvider
