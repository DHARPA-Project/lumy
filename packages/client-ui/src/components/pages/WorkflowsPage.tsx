import React from 'react'
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
import { useHistory } from 'react-router'
import WorkflowLoadingProgressDialog from '../common/WorkflowLoadingProgressDialog'
import useTheme from './WorkflowsPage.styles'

type PageFrameProps = { children: React.ReactNode }
const PageFrame: React.FC<PageFrameProps> = ({ children }: PageFrameProps) => {
  const classes = useTheme()

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper classes={{ root: classes.framePaper }}>
          <Typography variant="h5" classes={{ root: classes.pageLabel }}>
            Available Workflows
          </Typography>
          {children}
        </Paper>
      </Grid>
    </Grid>
  )
}

const CurrentWorkflowUrl = '/workflows/current'

const WorkflowsPage = (): JSX.Element => {
  const history = useHistory()
  const [workflows, isLoading] = useWorkflowList()
  const [, currentWorkflowMeta] = useCurrentWorkflow()
  const [newWorkflow, setNewWorkflow] = React.useState<WorkflowListItem>()
  const [workflowLoadingProgressMessages, workflowLoadingStatus] = useLoadWorkflow(
    newWorkflow?.body ?? newWorkflow?.uri
  )

  const classes = useTheme()

  /** After workflow has been loaded, redirect to current workflow page. */
  React.useEffect(() => {
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

  let component = <></>
  if (isLoading) component = <LoadingIndicator />
  else {
    if (workflows?.length === 0) component = <Typography>No workflows found</Typography>
    else
      component = (
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
      )
  }

  return (
    <PageFrame>
      {component}
      <WorkflowLoadingProgressDialog
        progressMessages={workflowLoadingProgressMessages}
        status={workflowLoadingStatus}
        onClose={() => setNewWorkflow(undefined)}
        open={newWorkflow != null}
      />
    </PageFrame>
  )
}

export default WorkflowsPage
