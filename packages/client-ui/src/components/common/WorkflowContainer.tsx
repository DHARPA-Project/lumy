import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit'

import { WorkflowContext } from '../../context/workflowContext'
import { featureList } from '../../const/features'
import useStyles from './WorkflowContainer.styles'

import FeatureTabs from './FeatureTabs'
import VerticalStepIndicator from './VerticalStepIndicator'
import WorkflowStep from './WorkflowStep'
import LoadingIndicator from './LoadingIndicator'

type screenSplitDirection = 'horizontal' | 'vertical'
type screenSplitOption = {
  name: screenSplitDirection
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

const positionOffset = '100vh'
const variants = {
  before: (direction: number) => ({
    y: direction > 0 ? positionOffset : `-${positionOffset}`,
    opacity: 0
  }),
  ready: {
    y: 0,
    opacity: 1
  },
  after: (direction: number) => ({
    y: direction > 0 ? `-${positionOffset}` : positionOffset,
    opacity: 0
  })
}

const WorkflowContainer = (): JSX.Element => {
  const stepContainerRef = useRef<HTMLDivElement>(null)
  const mainPaneRef = useRef<HTMLDivElement>(null)
  const additionalPaneRef = useRef<HTMLDivElement>(null)
  const dividerPosition = useRef<{ x?: number; y?: number }>(null)

  const {
    setFeatureTabIndex,
    projectSteps,
    activeStep,
    direction,
    setActiveStep,
    mainPaneWidth,
    setMainPaneWidth,
    mainPaneHeight,
    setMainPaneHeight,
    isAdditionalPaneVisible,
    setIsAdditionalPaneVisible
  } = useContext(WorkflowContext) //prettier-ignore

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)
  const [splitDirection, setSplitDirection] = useState<screenSplitDirection>('horizontal')

  const classes = useStyles()

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
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

  const handleOpenAdditionalPane = () => {
    if (splitDirection === 'vertical') {
      setMainPaneHeight(getStepContainerHeight() / 2)
    } else {
      setMainPaneWidth(getStepContainerWidth() / 2)
    }
    setIsAdditionalPaneVisible(true)
  }

  const handleCloseAdditionalPane = () => {
    setIsAdditionalPaneVisible(false)
    setMainPaneWidth(getStepContainerWidth())
    setMainPaneHeight(getStepContainerHeight())
  }

  const handleNextStepClick = () => {
    setActiveStep(([prevActiveStep, prevDirection]) => {
      const nextStep = prevActiveStep + 1
      if (nextStep >= projectSteps.length) return [prevActiveStep, prevDirection]
      return [nextStep, 1]
    })
  }

  const handlePreviousStepClick = () => {
    setActiveStep(([prevActiveStep, prevDirection]) => {
      const nextStep = prevActiveStep - 1
      if (nextStep < 0) return [prevActiveStep, prevDirection]
      return [nextStep, -1]
    })
  }

  if (!projectSteps?.length) return <LoadingIndicator />

  return (
    <>
      <div className={classes.workflowContainer}>
        <VerticalStepIndicator
          steps={projectSteps.map(projectStep => ({
            name: projectStep.step.moduleType
          }))}
          activeStep={activeStep}
          handleNext={handleNextStepClick}
          handleBack={handlePreviousStepClick}
        />

        <AnimatePresence
          custom={direction} // will ensure that leaving components animate using the latest data
          exitBeforeEnter // the exiting component will finish its exit animation before the entering component is rendered
        >
          <motion.div
            className={classes.stepContainer + ` ${splitDirection}`}
            ref={stepContainerRef}
            key={activeStep}
            variants={variants}
            initial="before"
            animate="ready"
            exit="after"
            custom={direction}
            transition={{
              y: { duration: 0.2, type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 }
            }}
          >
            <section className={classes.mainPane} ref={mainPaneRef}>
              <WorkflowStep projectSteps={projectSteps} activeStep={activeStep} />
            </section>

            {isAdditionalPaneVisible && (
              <>
                <div className={classes.paneDivider + ` ${splitDirection}`} onMouseDown={onMouseDown} />

                <section className={classes.additionalPane} ref={additionalPaneRef}>
                  <FeatureTabs />
                </section>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {isAdditionalPaneVisible ? (
        <SpeedDial
          ariaLabel="screen-split-options"
          className={classes.toolAreaToggle}
          icon={<SpeedDialIcon />}
          onClose={(_, reason: string) => {
            if (reason === 'toggle') handleCloseAdditionalPane()
            setIsSpeedDialOpen(false)
          }}
          onOpen={() => setIsSpeedDialOpen(true)}
          open={isSpeedDialOpen}
          direction="up"
          FabProps={{ size: 'small' }}
        >
          {screenSplitOptions.map((option, index) => (
            <SpeedDialAction
              key={index}
              icon={option.icon}
              tooltipTitle={option.tooltipText}
              onClick={() => setSplitDirection(option.direction as screenSplitDirection)}
            />
          ))}
        </SpeedDial>
      ) : (
        <SpeedDial
          ariaLabel="tools"
          className={classes.toolAreaToggle}
          icon={<SpeedDialIcon />}
          onClose={() => setIsSpeedDialOpen(false)}
          onOpen={() => setIsSpeedDialOpen(true)}
          open={isSpeedDialOpen}
          direction="up"
          FabProps={{ size: 'small' }}
        >
          {featureList.map((feature, index) => (
            <SpeedDialAction
              key={feature.id}
              icon={feature.icon}
              tooltipTitle={feature.tooltip}
              onClick={() => {
                console.log(`${feature.label} clicked`)
                setFeatureTabIndex(index)
                handleOpenAdditionalPane()
              }}
            />
          ))}
        </SpeedDial>
      )}
    </>
  )
}

export default WorkflowContainer
