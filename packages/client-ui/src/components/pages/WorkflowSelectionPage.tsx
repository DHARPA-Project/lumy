import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'

import {
  LumyWorkflowLoadStatus,
  useCurrentWorkflow,
  useLoadWorkflow,
  useWorkflowList,
  WorkflowListItem
} from '@dharpa-vre/client-core'
import { LoadingIndicator } from '@dharpa-vre/common-ui-components'

import { Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@material-ui/core'

import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'

import useStyles from './WorkflowSelectionPage.styles'

import WorkflowLoadingProgressDialog from '../common/WorkflowLoadingProgressDialog'

const CurrentWorkflowUrl = '/workflows/current'

const WorkflowSelectionPage = (): JSX.Element => {
  const classes = useStyles()

  const history = useHistory()

  const [newWorkflow, setNewWorkflow] = useState<WorkflowListItem>()

  const [workflows, isLoading] = useWorkflowList()
  const [, currentWorkflowMeta] = useCurrentWorkflow()
  const [workflowLoadingProgressMessages, workflowLoadingStatus] = useLoadWorkflow(
    newWorkflow?.body ?? newWorkflow?.uri
  )

  /** After workflow has been loaded, redirect to current workflow page. */
  useEffect(() => {
    if (newWorkflow != null && workflowLoadingStatus == LumyWorkflowLoadStatus.Loaded)
      history.push(CurrentWorkflowUrl)
  }, [workflowLoadingStatus])

  const isCurrentWorkflow = (workflow: WorkflowListItem): boolean => {
    return workflow.uri === currentWorkflowMeta?.uri
  }

  /** Workflow list item handler. */
  const handleClick = (workflow: WorkflowListItem): void => {
    if (isCurrentWorkflow(workflow)) history.push(CurrentWorkflowUrl)
    // otherwise indicate this workflow needs to be loaded and it will
    // be handled by `useLoadWorkflow`.
    else setNewWorkflow(workflow)
  }

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper classes={{ root: classes.framePaper }}>
          <Typography variant="h5" classes={{ root: classes.pageLabel }}>
            <FormattedMessage id="page.workflowSelection.label" />
          </Typography>

          {isLoading ? (
            <LoadingIndicator />
          ) : workflows?.length === 0 ? (
            <Typography>
              <FormattedMessage id="page.workflowSelection.message.noWorkflows" />
            </Typography>
          ) : (
            <List>
              {workflows.map(workflow => (
                <ListItem
                  key={workflow.uri}
                  button
                  classes={{ root: classes.listItem }}
                  onClick={() => handleClick(workflow)}
                  disabled={newWorkflow != null}
                >
                  <ListItemIcon>
                    {isCurrentWorkflow(workflow) ? (
                      <RadioButtonCheckedIcon classes={{ root: classes.checkedIcon }} />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={workflow.name} secondary={workflow.uri} />
                </ListItem>
              ))}
            </List>
          )}

          <WorkflowLoadingProgressDialog
            progressMessages={workflowLoadingProgressMessages}
            status={workflowLoadingStatus}
            onClose={() => setNewWorkflow(undefined)}
            open={newWorkflow != null}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

export default WorkflowSelectionPage
