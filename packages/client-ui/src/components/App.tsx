import React from 'react'
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom'
import { ThemeContextProvider } from '@lumy/styles'
import { useSystemInfo } from '@dharpa-vre/client-core'

import PageLayoutContextProvider from '../context/pageLayoutContext'
import ProjectContextProvider from '../context/projectContext'

import TopPageLayout from './common/TopPageLayout'
import HomePage from './pages/HomePage'
import NetworkAnalysisPage from './pages/NetworkAnalysisPage'
// import IntroPage from './pages/IntroPage'
import ToyVrePage from './pages/ToyVrePage'
// import NetworkAnalysisIntroPage from './pages/NetworkAnalysisIntroPage'
// import ProjectPage from './pages/ProjectPage'
import LabPage from './pages/LabPage'
import PlaygroundPage from './pages/PlaygroundPage'
import WorkflowProjectPage from './pages/WorkflowProjectPage'
import DataRegistryPage from './pages/DataRegistryPage'
import DataRegistryFormModal from './common/registry/DataRegistryFormModal'
import WorkflowsPage from './pages/WorkflowsPage'
import CurrentWorkflowPage from './pages/CurrentWorkflowPage'

const WorkflowUrlPrefix = '/workflows/network-analysis/directed'

export const App = (): JSX.Element => {
  const systemInfo = useSystemInfo()

  React.useEffect(() => {
    if (systemInfo == null) return
    console.info(`💫💫💫 Lumy System Info: ${JSON.stringify(systemInfo)}`)
  }, [systemInfo])

  return (
    <ThemeContextProvider>
      <PageLayoutContextProvider>
        <ProjectContextProvider>
          <Router>
            <TopPageLayout>
              <Switch>
                <Route path="/workflows" exact component={WorkflowsPage} />
                <Route path="/workflows/current/:stepId?" exact component={CurrentWorkflowPage} />

                {/* TODO: the route below contains a hardcoded workflow. This will be removed soon. */}
                <Route path="/workflows/network-analysis" exact component={NetworkAnalysisPage} />
                {/* TODO: the route below contains a hardcoded workflow. This will be removed soon. */}
                <Route
                  path={`${WorkflowUrlPrefix}/:stepId?`}
                  exact
                  component={() => <WorkflowProjectPage pageUrlPrefix={WorkflowUrlPrefix} />}
                />
                {/* <Route path="/intro" exact component={IntroPage} /> */}
                {/* <Route path="/projects/:id" exact component={ProjectPage} /> */}
                <Route path="/dataregistry" component={DataRegistryPage} />
                <Route path="/playground" exact component={PlaygroundPage} />
                <Route path="/toy" exact component={ToyVrePage} />
                <Route path="/lab" exact component={LabPage} />
                <Route path="/home" exact component={HomePage} />
                <Redirect to="/home" />
              </Switch>

              <Route path="/dataregistry/add" exact component={DataRegistryFormModal} />
              <Route path="/dataregistry/edit/:id" exact component={DataRegistryFormModal} />
            </TopPageLayout>
          </Router>
        </ProjectContextProvider>
      </PageLayoutContextProvider>
    </ThemeContextProvider>
  )
}
