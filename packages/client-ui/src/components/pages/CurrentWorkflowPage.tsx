import React, { useContext, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { useHistory } from 'react-router-dom'

import { useCurrentWorkflow } from '@lumy/client-core'
import { Container, Paper, Typography } from '@material-ui/core'

import useStyles from './CurrentWorkflowPage.styles'
import { WorkflowContext, WorkflowProvider } from '../../state'

import WorkflowContainer from '../common/WorkflowContainer'
import { FormattedMessage } from '@lumy/i18n'

interface RouterParams {
  stepId?: string
}

const PageContent = (): JSX.Element => {
  const isInitialRender = useRef(true)
  const history = useHistory()
  const { stepId: urlPageId } = useParams<RouterParams>()

  const { currentPageId, setCurrentPageId, setCurrentPageIndexAndDirection } = useContext(WorkflowContext)

  useEffect(() => {
    if (urlPageId != null) setCurrentPageId(urlPageId)
    else setCurrentPageIndexAndDirection([0, 0])
  }, [urlPageId])

  useEffect(() => {
    if (isInitialRender.current) return
    if (currentPageId != null && currentPageId != urlPageId) {
      const newUrl = `/workflows/current/${currentPageId}`
      // if there is no page ID slug, replace the url to avoid
      // having same page twice in the history
      if (urlPageId == null) history.replace(newUrl)
      else history.push(newUrl)
    }
  }, [currentPageId])

  useEffect(() => {
    isInitialRender.current = false
  }, [])

  return <WorkflowContainer />
}

const CurrentWorkflowPage = (): JSX.Element => {
  const classes = useStyles()
  const [workflow, , isLoading] = useCurrentWorkflow()

  if (isLoading) return <></>
  if (!isLoading && workflow == null)
    return (
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

  return (
    <WorkflowProvider>
      <PageContent />
    </WorkflowProvider>
  )
}

export default CurrentWorkflowPage
