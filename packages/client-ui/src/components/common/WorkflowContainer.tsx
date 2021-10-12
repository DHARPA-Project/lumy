import React, { useContext } from 'react'

import { useTheme } from '@material-ui/core/styles'
import { motion, AnimatePresence } from 'framer-motion'

import { LoadingIndicator, ResizablePanes } from '@lumy/common-ui-components'

import { WorkflowContext } from '../../state'
import useStyles from './WorkflowContainer.styles'

import FeatureTabs from './features/FeatureTabs'
import VerticalStepIndicator from './VerticalStepIndicator'
import WorkflowStep from './WorkflowStep'
import FeaturePaneMenu from './features/FeaturePaneMenu'

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
    proceedToNextStep,
    returnToPreviousStep
  } = useContext(WorkflowContext)
  const theme = useTheme()
  const classes = useStyles()

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

      <FeaturePaneMenu />
    </>
  )
}

export default WorkflowContainer
