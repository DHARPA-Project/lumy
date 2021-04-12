import React from 'react'
import { Switch, Route, HashRouter as Router, Redirect } from 'react-router-dom'

import ThemeContextProvider from '../context/themeContext'

import TopPageLayout from './common/TopPageLayout'
import SettingsPage from './pages/SettingsPage'
import IntroPage from './pages/IntroPage'
import ToyVrePage from './pages/ToyVrePage'

export const App = (): JSX.Element => {
  return (
    <ThemeContextProvider>
      <Router>
        <TopPageLayout>
          <Switch>
            <Redirect from="/" exact to="/intro" />
            <Route path="/intro" exact component={IntroPage} />
            <Route path="/settings" exact component={SettingsPage} />
            <Route path="/toy" exact component={ToyVrePage} />
          </Switch>
        </TopPageLayout>
      </Router>
    </ThemeContextProvider>
  )
}
