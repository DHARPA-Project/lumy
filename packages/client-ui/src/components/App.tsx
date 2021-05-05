import React from 'react'
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom'

import ThemeContextProvider from '../context/themeContext'
import PageLayoutContextProvider from '../context/pageLayoutContext'
import ProjectContextProvider from '../context/projectContext'

import TopPageLayout from './common/TopPageLayout'
import IntroPage from './pages/IntroPage'
import ToyVrePage from './pages/ToyVrePage'
import NetworkAnalysisIntroPage from './pages/NetworkAnalysisIntroPage'
import ProjectPage from './pages/ProjectPage'

export const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <PageLayoutContextProvider>
        <ProjectContextProvider>
          <Router>
            <TopPageLayout>
              <Switch>
                <Redirect from="/" exact to="/intro" />
                <Route path="/intro" exact component={IntroPage} />
                <Route path="/toy" exact component={ToyVrePage} />
                <Route path="/workflows/network-analysis" exact component={NetworkAnalysisIntroPage} />
                <Route path="/projects/:id" exact component={ProjectPage} />
              </Switch>
            </TopPageLayout>
          </Router>
        </ProjectContextProvider>
      </PageLayoutContextProvider>
    </ThemeContextProvider>
  )
}
