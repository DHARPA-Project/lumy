import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error'

import {
  LoadProgress,
  LumyWorkflowLoadStatus,
  WorkflowLoadProgressMessageType
} from '@dharpa-vre/client-core'
import useTheme from './WorkflowLoadingProgressDialog.styles'
import { Alert } from '@material-ui/lab'
import { FormattedMessage } from 'react-intl'

const AlwaysScrollToBottom = (): JSX.Element => {
  const elementRef = React.useRef(null)
  React.useEffect(() => elementRef?.current?.scrollIntoView())
  return <div ref={elementRef} />
}

interface Props {
  progressMessages: LoadProgress[]
  status: LumyWorkflowLoadStatus
  open: boolean
  onClose: () => void
}
const WorkflowLoadingProgressDialog = ({ progressMessages, status, open, onClose }: Props): JSX.Element => {
  const classes = useTheme()

  return (
    <Dialog open={open} classes={{ paper: classes.dialog }}>
      <DialogTitle>
        <FormattedMessage id="modal.workflowLoading.title" />
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item classes={{ root: classes.dialogLogPanel }}>
            <List>
              {progressMessages.map((msg, idx) => {
                return (
                  <ListItem key={idx}>
                    {msg.type === WorkflowLoadProgressMessageType.Error ? (
                      <ListItemIcon>
                        <ErrorIcon classes={{ root: classes.errorIcon }} />
                      </ListItemIcon>
                    ) : (
                      ''
                    )}
                    <ListItemText
                      primary={msg.message}
                      inset={msg.type !== WorkflowLoadProgressMessageType.Error}
                    />
                  </ListItem>
                )
              })}
            </List>
            <AlwaysScrollToBottom />
          </Grid>
          <Grid item classes={{ root: classes.dialogSectionFullWidth }}>
            {status == LumyWorkflowLoadStatus.NotLoaded ? (
              <Alert severity="error">
                <FormattedMessage id="modal.workflowLoading.messages.loadingError" />
              </Alert>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {status == LumyWorkflowLoadStatus.NotLoaded ? (
          <Button onClick={onClose} variant="outlined">
            <FormattedMessage id="modal.workflowLoading.button.close" />
          </Button>
        ) : (
          ''
        )}
      </DialogActions>
    </Dialog>
  )
}

export default WorkflowLoadingProgressDialog
