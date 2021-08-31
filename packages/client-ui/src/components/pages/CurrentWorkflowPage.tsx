import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import { useCurrentWorkflow } from '@dharpa-vre/client-core'
import { Container, Paper, Typography } from '@material-ui/core'

import useStyles from './CurrentWorkflowPage.styles'
import { WorkflowContext, WorkflowProvider } from '../../state'

import WorkflowContainer from '../common/WorkflowContainer'
import { FormattedMessage } from 'react-intl'

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
          <FormattedMessage
            id="page.currentWorkflow.message.noWorkflowSelected"
            values={{
              link: (
                <a href="#/workflows">
                  <FormattedMessage id="page.currentWorkflow.label.workflowList" />
                </a>
              )
            }}
          />
        </Typography>
      </Paper>
    </Container>
  )
}

const CurrentWorkflowPage = (): JSX.Element => {
  return (
    <WorkflowProvider>
      <PageContent />
    </WorkflowProvider>
  )
}

export default CurrentWorkflowPage
