import React from 'react'
import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { Container, Paper, Typography } from '@material-ui/core'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import WorkflowContextProvider, { WorkflowContext } from '../../context/workflowContext'
import WorkflowContainer from '../common/WorkflowContainer'
import useStyles from './CurrentWorkflowPage.styles'

const NoWorkflowPanel = () => {
  const classes = useStyles()

  return (
    <Container classes={{ root: classes.noWorkflowContainer }}>
      <Paper classes={{ root: classes.noWorkflowPanel }}>
        <Typography align="center">
          No workflow selected. Please select one from <a href="#/workflows">the workflow list</a>.
        </Typography>
      </Paper>
    </Container>
  )
}

interface RouterParams {
  stepId?: string
}

const PageContent = (): JSX.Element => {
  const { stepId: urlPageId } = useParams<RouterParams>()
  const history = useHistory()
  const [workflow, , isLoading] = useCurrentWorkflow()
  const { currentPageId, setCurrentPageId, setCurrentPageIndexAndDirection } = React.useContext(
    WorkflowContext
  )

  React.useEffect(() => {
    if (urlPageId != null) setCurrentPageId(urlPageId)
    else setCurrentPageIndexAndDirection([0, 0])
  }, [urlPageId])

  React.useEffect(() => {
    if (currentPageId != null && currentPageId != urlPageId) {
      const newUrl = `/workflows/current/${currentPageId}`
      // if there is no page ID slug, replace the url to avoid
      // having same page twice in the history
      if (urlPageId == null) history.replace(newUrl)
      else history.push(newUrl)
    }
  }, [currentPageId])

  if (!isLoading && workflow == null) return <NoWorkflowPanel />
  return <WorkflowContainer />
}

const CurrentWorkflowPage = (): JSX.Element => {
  return (
    <WorkflowContextProvider>
      <PageContent />
    </WorkflowContextProvider>
  )
}

export default CurrentWorkflowPage
