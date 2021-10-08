import React, { useContext, useState } from 'react'

import { useTheme } from '@material-ui/core/styles'
import { motion, AnimatePresence } from 'framer-motion'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import { LoadingIndicator, ResizablePanes } from '@lumy/common-ui-components'

import { WorkflowContext, screenSplitDirectionType } from '../../state'
import { useAppFeatures } from '../../const/features'
import useStyles from './WorkflowContainer.styles'

import FeatureTabs from './FeatureTabs'
import VerticalStepIndicator from './VerticalStepIndicator'
import WorkflowStep from './WorkflowStep'

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
    workflowMeta,
    currentPageIndex,
    currentPageDetails,
    direction,
    isAdditionalPaneVisible,
    stepContainerRef,
    splitDirection,
    setSplitDirection,
    screenSplitOptions,
    proceedToNextStep,
    returnToPreviousStep,
    closeAdditionalPane,
    openFeatureTab
  } = useContext(WorkflowContext) //prettier-ignore
  const theme = useTheme()
  const classes = useStyles()
  const featureList = useAppFeatures()

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)

  if (workflowPages?.length === 0) return <LoadingIndicator />

  return (
    <>
      <div className={classes.workflowContainer}>
        <VerticalStepIndicator
          steps={workflowPages?.map(workflowPage => ({
            name: workflowPage.meta?.label ?? `Page ${workflowPage.id}`
          }))}
          currentPageIndex={currentPageIndex}
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
            key={currentPageIndex}
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
            <ResizablePanes
              orientation={splitDirection}
              style={{ height: '100vh' }}
              minPaneSize={theme.spacing(40)}
              dividerPalette={{
                idle: theme.palette.grey[100],
                hovered: theme.palette.grey[200],
                valid: theme.palette.primary.light,
                invalid: theme.palette.error.light
              }}
            >
              <WorkflowStep pageDetails={currentPageDetails} workflowLabel={workflowMeta.label} />

              {isAdditionalPaneVisible && <FeatureTabs />}
            </ResizablePanes>
          </motion.div>
        </AnimatePresence>
      </div>

      <SpeedDial
        classes={{
          root: classes.speedDialRoot,
          fab: classes.speedDialFab,
          actions: classes.speedDialActions,
          directionUp: classes.speedDialDirectionUp,
          directionDown: classes.speedDialDirectionDown,
          directionLeft: classes.speedDialDirectionLeft,
          directionRight: classes.speedDialDirectionRight
        }}
        onClose={(_, reason: string) => {
          if (isAdditionalPaneVisible && reason === 'toggle') closeAdditionalPane()
          setIsSpeedDialOpen(false)
        }}
        onOpen={() => setIsSpeedDialOpen(true)}
        open={isSpeedDialOpen}
        icon={<SpeedDialIcon />}
        direction="up"
        FabProps={{ size: 'small' }}
        ariaLabel={isAdditionalPaneVisible ? 'screen-split-options' : 'tools'}
      >
        {isAdditionalPaneVisible
          ? screenSplitOptions.map((option, index) => (
              <SpeedDialAction
                key={index}
                icon={option.icon}
                tooltipTitle={option.tooltipText}
                onClick={() => setSplitDirection(option.direction as screenSplitDirectionType)}
                classes={{ fab: classes.speedDialActionFab }}
              />
            ))
          : featureList.map((feature, index) => (
              <SpeedDialAction
                key={feature.id}
                icon={feature.icon}
                tooltipTitle={feature.tooltip}
                onClick={() => openFeatureTab(index)}
                classes={{ fab: classes.speedDialActionFab }}
              />
            ))}
      </SpeedDial>
    </>
  )
}

export default WorkflowContainer
