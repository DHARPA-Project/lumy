import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Grow from '@material-ui/core/Grow'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { ModuleViewFactory } from '@dharpa-vre/client-core'
import { StepDesc } from '@dharpa-vre/client-core/src/common/types/kiaraGenerated'

import useStyles from './WorkflowStep.styles'

type WorkflowStepProps = {
  projectSteps: StepDesc[]
  activeStep: number
  direction: number
}

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

const WorkflowStep = ({ projectSteps, activeStep, direction }: WorkflowStepProps): JSX.Element => {
  const classes = useStyles()

  return (
    <AnimatePresence
      custom={direction} // will ensure that leaving components animate using the latest data
      // initial={false} // disable initial animations on children when the component is first rendered
      exitBeforeEnter // exiting component will finish its exit animation before the entering component is rendered
    >
      <motion.div
        className={classes.stepContent}
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
        <Grow
          in={!!projectSteps[activeStep]?.step?.moduleType}
          style={{ transformOrigin: '0 0 0' }}
          timeout={1000}
        >
          <>
            <Typography className={classes.headline} variant="h6" component="h1" align="left">
              Network Analysis
            </Typography>

            <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
              {[projectSteps[activeStep]?.step?.parentId, projectSteps[activeStep]?.step?.moduleType].map(
                (path, index) => (
                  <Typography color="textPrimary" key={index}>
                    {path}
                  </Typography>
                )
              )}
            </Breadcrumbs>

            <Divider className={classes.divider} />

            <ModuleViewFactory
              step={projectSteps[activeStep]?.step}
              inputConnections={projectSteps[activeStep]?.inputConnections}
              outputConnections={projectSteps[activeStep]?.outputConnections}
            />
          </>
        </Grow>
      </motion.div>
    </AnimatePresence>
  )
}

export default WorkflowStep
