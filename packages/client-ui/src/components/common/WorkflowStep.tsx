import React from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { ModuleViewFactory } from '@dharpa-vre/client-core'
import { StepDesc } from '@dharpa-vre/client-core/src/common/types/kiaraGenerated'

import useStyles from './WorkflowStep.styles'

type WorkflowStepProps = {
  projectSteps: StepDesc[]
  activeStep: number
}

const WorkflowStep = ({ projectSteps, activeStep }: WorkflowStepProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.mainWrapper}>
      <header className={classes.header}>
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

        <Divider />
      </header>

      <div className={classes.mainContent}>
        <ModuleViewFactory
          step={projectSteps[activeStep]?.step}
          inputConnections={projectSteps[activeStep]?.inputConnections}
          outputConnections={projectSteps[activeStep]?.outputConnections}
        />
      </div>
    </div>
  )
}

export default WorkflowStep
