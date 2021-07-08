import React from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { ModuleViewFactory, WorkflowPageDetails } from '@dharpa-vre/client-core'

import useStyles from './WorkflowStep.styles'

type WorkflowStepProps = {
  workflowPages: WorkflowPageDetails[]
  activeStep: number
}

const WorkflowStep = ({ workflowPages, activeStep }: WorkflowStepProps): JSX.Element => {
  const classes = useStyles()

  const currentPageDetails = workflowPages?.[activeStep]

  return (
    <div className={classes.mainWrapper}>
      <header className={classes.header}>
        <Typography className={classes.headline} variant="h6" component="h1" align="left">
          Network Analysis
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          <Typography color="textPrimary">
            {currentPageDetails?.meta?.label ?? `Page ${currentPageDetails?.id}`}
          </Typography>
        </Breadcrumbs>
        <Divider />
      </header>

      <div className={classes.mainContent}>
        <ModuleViewFactory pageDetails={currentPageDetails} />
      </div>
    </div>
  )
}

export default WorkflowStep
