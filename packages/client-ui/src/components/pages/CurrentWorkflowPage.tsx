import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { Container, Paper, Typography } from '@material-ui/core'

import WorkflowContextProvider, { WorkflowContext } from '../../context/workflowContext'
import useStyles from './CurrentWorkflowPage.styles'

import WorkflowContainer from '../common/WorkflowContainer'

interface RouterParams {
  stepId?: string
}

const PageContent = (): JSX.Element => {
  const classes = useStyles()

  const history = useHistory()
  const { stepId: urlPageId } = useParams<RouterParams>()

  const [workflow, , isLoading] = useCurrentWorkflow()
  const { currentPageId, setCurrentPageId, setCurrentPageIndexAndDirection } = useContext(WorkflowContext)

  useEffect(() => {
    if (urlPageId != null) setCurrentPageId(urlPageId)
    else setCurrentPageIndexAndDirection([0, 0])
  }, [urlPageId])

  useEffect(() => {
    if (currentPageId != null && currentPageId != urlPageId) {
      const newUrl = `/workflows/current/${currentPageId}`
      // if there is no page ID slug, replace the url to avoid
      // having same page twice in the history
      if (urlPageId == null) history.replace(newUrl)
      else history.push(newUrl)
    }
  }, [currentPageId])

  return !isLoading && workflow != null ? (
    <WorkflowContainer />
  ) : (
    <Container classes={{ root: classes.noWorkflowContainer }}>
      <Paper classes={{ root: classes.noWorkflowPanel }}>
        <Typography align="center">
          No workflow selected. Please select one from <a href="#/workflows">the workflow list</a>.
        </Typography>
      </Paper>
    </Container>
  )
}

const CurrentWorkflowPage = (): JSX.Element => {
  return (
    <WorkflowContextProvider>
      <PageContent />
    </WorkflowContextProvider>
  )
}

export default CurrentWorkflowPage
