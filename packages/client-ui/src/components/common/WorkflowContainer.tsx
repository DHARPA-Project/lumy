import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import { WorkflowContext, screenSplitDirectionType } from '../../context/workflowContext'
import { featureList } from '../../const/features'
import useStyles from './WorkflowContainer.styles'

import FeatureTabs from './FeatureTabs'
import VerticalStepIndicator from './VerticalStepIndicator'
import WorkflowStep from './WorkflowStep'
import LoadingIndicator from './LoadingIndicator'

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
  const {
    workflowPages,
    activeStep,
    direction,
    isAdditionalPaneVisible,
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
  } = useContext(WorkflowContext) //prettier-ignore

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)

  const classes = useStyles()

  if (workflowPages?.length === 0) return <LoadingIndicator />

  return (
    <>
      <div className={classes.workflowContainer}>
        <VerticalStepIndicator
          steps={workflowPages?.map(workflowPage => ({
            name: workflowPage.meta?.label ?? `Page ${workflowPage.id}`
          }))}
          activeStep={activeStep}
          handleNext={proceedToNextStep}
          handleBack={returnToPreviousStep}
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
              <WorkflowStep workflowPages={workflowPages} activeStep={activeStep} />
            </section>

            <div
              className={
                classes.paneDivider + (isAdditionalPaneVisible ? '' : ' invisible') + ` ${splitDirection}`
              }
              onMouseDown={onMouseDown}
            />

            <section
              className={classes.additionalPane + (isAdditionalPaneVisible ? '' : ' invisible')}
              ref={additionalPaneRef}
            >
              <FeatureTabs />
            </section>
          </motion.div>
        </AnimatePresence>
      </div>

      {isAdditionalPaneVisible ? (
        <SpeedDial
          ariaLabel="screen-split-options"
          className={classes.toolAreaToggle}
          icon={<SpeedDialIcon />}
          onClose={(_, reason: string) => {
            if (reason === 'toggle') closeAdditionalPane()
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
              onClick={() => setSplitDirection(option.direction as screenSplitDirectionType)}
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
              onClick={() => openFeatureTab(index)}
            />
          ))}
        </SpeedDial>
      )}
    </>
  )
}

export default WorkflowContainer
