import React, { useContext, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Fab from '@material-ui/core/fab'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import CloseIcon from '@material-ui/icons/Close'

import { WorkflowContext } from '../../context/workflowContext'
import useStyles from './WorkflowContainer.styles'
import { featureList } from '../../const/features'

import FeatureTabs from './FeatureTabs'
import VerticalStepIndicator from './VerticalStepIndicator'
import WorkflowStep from './WorkflowStep'
import LoadingIndicator from './LoadingIndicator'

const WorkflowContainer = (): JSX.Element => {
  const stepContainerRef = useRef<HTMLDivElement>(null)
  const mainPaneRef = useRef<HTMLDivElement>(null)
  const additionalPaneRef = useRef<HTMLDivElement>(null)
  const yDividerPos = useRef(0)
  const xDividerPos = useRef(0)

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

  const classes = useStyles()

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  useEffect(() => {
    if (!mainPaneWidth) return

    mainPaneRef.current.style.minWidth = mainPaneWidth + 'px'
    mainPaneRef.current.style.maxWidth = mainPaneWidth + 'px'
  }, [mainPaneWidth])

  const getStepContainerWidth = () => stepContainerRef.current?.getBoundingClientRect()?.width

  const onMouseDown = (event: React.MouseEvent): void => {
    yDividerPos.current = event.clientY
    xDividerPos.current = event.clientX
  }

  const onMouseUp = (): void => {
    yDividerPos.current = null
    xDividerPos.current = null
  }

  const onMouseMove = (event: React.MouseEvent): void => {
    if (!yDividerPos.current && !xDividerPos.current) return

    setMainPaneHeight(mainPaneHeight + event.clientY - yDividerPos.current)
    setMainPaneWidth(prevWidth => {
      const newWidth = prevWidth + event.clientX - xDividerPos.current
      const stepContainerWidth = getStepContainerWidth()
      return newWidth <= 0.65 * stepContainerWidth && newWidth >= 0.35 * stepContainerWidth
        ? newWidth
        : prevWidth
    })

    yDividerPos.current = event.clientY
    xDividerPos.current = event.clientX
  }

  const handleOpenAdditionalPane = () => {
    setMainPaneWidth(getStepContainerWidth() / 2)
    setIsAdditionalPaneVisible(true)
  }

  const handleCloseAdditionalPane = () => {
    setIsAdditionalPaneVisible(false)
    setMainPaneWidth(getStepContainerWidth())
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

        <div className={classes.stepContainer} ref={stepContainerRef}>
          <section className={classes.mainPane} ref={mainPaneRef}>
            <WorkflowStep projectSteps={projectSteps} activeStep={activeStep} direction={direction} />
          </section>

          {isAdditionalPaneVisible && (
            <>
              <div className={classes.verticalPaneDivider} onMouseDown={onMouseDown} />

              <AnimatePresence>
                <motion.section
                  className={classes.additionalPane}
                  ref={additionalPaneRef}
                  initial={{ x: '100vw', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100vw', opacity: 0 }}
                  transition={{
                    y: { duration: 0.3, type: 'tween' },
                    opacity: { duration: 0.3 }
                  }}
                >
                  <FeatureTabs />
                </motion.section>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
      {isAdditionalPaneVisible ? (
        <Fab
          className={classes.toolAreaToggle}
          onClick={handleCloseAdditionalPane}
          size="small"
          color="primary"
          aria-label="toggle"
        >
          <CloseIcon />
        </Fab>
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
