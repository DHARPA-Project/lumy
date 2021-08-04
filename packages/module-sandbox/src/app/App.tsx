import React from 'react'
import { useHistory, HashRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom'
import { Grid } from '@material-ui/core'
import { BackEndContextProvider } from '@dharpa-vre/client-core'
import { ThemeContextProvider, DefaultModuleComponentPanel } from '@dharpa-vre/client-ui'
import { ModuleSelector } from './ModuleSelector'
import { ModuleView } from './ModuleView'
import { SandboxContext } from '../backEndContext/sandbox'
import { buildPlaygroundWorkflow } from './workflowUtils'
import useStyles from './App.styles'

const buildContext = (moduleId: string | undefined): SandboxContext => {
  return new SandboxContext({
    currentWorkflow: buildPlaygroundWorkflow(moduleId),
    defaultModuleComponent: DefaultModuleComponentPanel
  })
}

const SandboxApp = (): JSX.Element => {
  const classes = useStyles()
  const match = useRouteMatch<{ moduleId: string }>('/:moduleId')
  const currentModuleId = match?.params?.moduleId
  const [context, setContext] = React.useState(buildContext(currentModuleId))
  const history = useHistory()
  const setCurrentModuleId = (moduleId: string) => {
    history.push(`/${moduleId}`)
  }
  console.log('***', currentModuleId)

  React.useEffect(() => setContext(buildContext(currentModuleId)), [currentModuleId])

  return (
    <BackEndContextProvider value={context}>
      <ThemeContextProvider>
        <Switch>
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
