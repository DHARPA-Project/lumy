import React from 'react'
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom'

import { RootProvider } from '../state'

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

const WorkflowUrlPrefix = '/workflows/network-analysis/directed'

export const App = (): JSX.Element => {
  return (
    <RootProvider>
      <Router>
        <TopPageLayout>
          <Switch>
            <Route path="/workflows/network-analysis" exact component={NetworkAnalysisPage} />
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
    </RootProvider>
  )
}
