import React from 'react'
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom'

import { useSystemInfo } from '@lumy/client-core'

import { RootProvider } from '../state'

import TopPageLayout from './common/TopPageLayout'
import HomePage from './pages/HomePage'
import NetworkAnalysisPage from './pages/NetworkAnalysisPage'
// import IntroPage from './pages/IntroPage'
// import NetworkAnalysisIntroPage from './pages/NetworkAnalysisIntroPage'
// import ProjectPage from './pages/ProjectPage'
import LabPage from './pages/LabPage'
import PlaygroundPage from './pages/PlaygroundPage'
import WorkflowProjectPage from './pages/WorkflowProjectPage'
import DataRegistryPage from './pages/DataRegistryPage'
import DataRegistryFormModal from './common/registry/DataRegistryFormModal'
import ToastContainer from './common/notifications/ToastContainer'
import WorkflowSelectionPage from './pages/WorkflowSelectionPage'
import CurrentWorkflowPage from './pages/CurrentWorkflowPage'
import { AppTopLevelDomElementId } from '../const/app'

export const App = (): JSX.Element => {
  const systemInfo = useSystemInfo()

  React.useEffect(() => {
    if (systemInfo == null) return
    console.info(`💫💫💫 Lumy System Info: ${JSON.stringify(systemInfo)}`)
  }, [systemInfo])

  return (
    <div id={AppTopLevelDomElementId}>
      <RootProvider>
        <Router>
          <TopPageLayout>
            <Switch>
              <Route path="/workflows" exact component={WorkflowSelectionPage} />
              <Route path="/workflows/current/:stepId?" exact component={CurrentWorkflowPage} />

              {/* TODO: the route below contains a hardcoded workflow. This will be removed soon. */}
              <Route path="/workflow-categories/network-analysis" exact component={NetworkAnalysisPage} />
              {/* TODO: the route below contains a hardcoded workflow. This will be removed soon. */}
              <Route
                path="/workflow-categories/network-analysis/directed/:stepId?"
                exact
                component={() => (
                  <WorkflowProjectPage pageUrlPrefix="/workflow-categories/network-analysis/directed" />
                )}
              />
              {/* <Route path="/intro" exact component={IntroPage} /> */}
              {/* <Route path="/projects/:id" exact component={ProjectPage} /> */}
              <Route path="/dataregistry" component={DataRegistryPage} />
              <Route path="/playground" exact component={PlaygroundPage} />
              <Route path="/lab" exact component={LabPage} />
              <Route path="/home" exact component={HomePage} />
              <Redirect to="/home" />
            </Switch>

            <Route path="/dataregistry/add" exact component={DataRegistryFormModal} />
            <Route path="/dataregistry/edit/:id" exact component={DataRegistryFormModal} />
          </TopPageLayout>

          <ToastContainer />
        </Router>
      </RootProvider>
    </div>
  )
}
