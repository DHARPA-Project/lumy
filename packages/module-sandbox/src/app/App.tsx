import React from 'react'
import { useHistory, HashRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { BackEndContextProvider } from '@lumy/client-core'
import { DefaultModuleComponentPanel } from '@lumy/client-ui'
import { ThemeContextProvider, useUserLanguageCode } from '@lumy/styles'
import { ModuleSelector } from './ModuleSelector'
import { ModuleView } from './ModuleView'
import { SandboxContext } from '../backEndContext/sandbox'
import { buildPlaygroundWorkflow } from './workflowUtils'
import useStyles from './App.styles'
import { AutoUiMainPanel } from '../autoui/Main'

const buildContext = (moduleId: string | undefined): SandboxContext => {
  return new SandboxContext({
    currentWorkflow: buildPlaygroundWorkflow(moduleId),
    defaultModuleComponent: DefaultModuleComponentPanel
  })
}

const SandboxApp = (): JSX.Element => {
  const [language] = useUserLanguageCode()
  const classes = useStyles()
  const match = useRouteMatch<{ moduleId: string }>('/:moduleId')
  const currentModuleId = match?.params?.moduleId
  const [context, setContext] = React.useState(buildContext(currentModuleId))
  const history = useHistory()
  const setCurrentModuleId = (moduleId: string) => {
    history.push(`/${moduleId}`)
  }

  React.useEffect(() => setContext(buildContext(currentModuleId)), [currentModuleId])

  return (
    <BackEndContextProvider value={context}>
      <ThemeContextProvider locale={language}>
        <Switch>
          <Route path="/autoui">
            <Grid container direction="column" className={classes.root}>
              <AutoUiMainPanel />
            </Grid>
          </Route>
          <Route path="/:moduleId?">
            <Grid container direction="column" className={classes.root}>
              <ModuleSelector
                moduleId={currentModuleId}
                setModuleId={setCurrentModuleId}
                className={classes.moduleSelector}
              />
              <ModuleView moduleId={currentModuleId} className={classes.moduleView} />
            </Grid>
          </Route>
        </Switch>
      </ThemeContextProvider>
    </BackEndContextProvider>
  )
}

export const App = (): JSX.Element => {
  return (
    <Router>
      <SandboxApp />
    </Router>
  )
}
