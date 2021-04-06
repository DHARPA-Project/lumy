import React from 'react'
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom'

import ThemeContextProvider from '../context/themeContext'

import TopPageLayout from './common/TopPageLayout'
import SettingsPage from './pages/SettingsPage'
import NotificationsPage from './pages/NotificationsPage'
import TestPage from './pages/TestPage'
import SamplePage from './pages/SamplePage'
import ToyVrePage from './pages/ToyVrePage'

export const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <Router>
        <TopPageLayout>
          <Switch>
            <Redirect from="/" exact to="/settings" />
            <Route path="/settings" exact component={SettingsPage} />
            <Route path="/notifications" exact component={NotificationsPage} />
            <Route path="/test" exact component={TestPage} />
            <Route path="/sample" exact component={SamplePage} />
            <Route path="/toy" exact component={ToyVrePage} />
          </Switch>
        </TopPageLayout>
      </Router>
    </ThemeContextProvider>
  )
}
