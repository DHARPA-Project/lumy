import React from 'react'

import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { ModuleViewFactory, WorkflowPageDetails } from '@dharpa-vre/client-core'

import useStyles from './WorkflowStep.styles'

type WorkflowStepProps = {
  pageDetails: WorkflowPageDetails
  workflowLabel: string
}

const WorkflowStep = ({ pageDetails, workflowLabel }: WorkflowStepProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.mainWrapper}>
      <header className={classes.header}>
        <Typography className={classes.headline} variant="h6" component="h1" align="left">
          <Typography color="textPrimary">{workflowLabel}</Typography>
        </Typography>

        <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
          <Typography color="textPrimary">{pageDetails.meta?.label ?? `Page ${pageDetails.id}`}</Typography>
        </Breadcrumbs>
        <Divider />
      </header>

      <div className={classes.mainContent}>
        <ModuleViewFactory pageDetails={pageDetails} />
      </div>
    </div>
  )
}

export default WorkflowStep
