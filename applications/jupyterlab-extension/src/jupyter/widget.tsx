import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { KernelModuleContext } from './kernelContext'

// TODO: Import once ready
// import { ModuleContextProvider, useBackendIsReady } from '@dharpa-vre/client-core'
const useBackendIsReady = (): boolean => true
const ModuleContextProvider = React.createContext(null).Provider

const App = () => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <b>Backend not ready yet...</b>

  return (
    <>
      <p>VRE will be here</p>
    </>
  )
}

export class KernelView extends ReactWidget {
  private _context: KernelModuleContext

  constructor(context: KernelModuleContext) {
    super()
    this._context = context
    this.addClass('dharpa-scrollable-panel')
  }

  protected render(): React.ReactElement<unknown> {
    return (
      <ModuleContextProvider value={this._context}>
        <App />
      </ModuleContextProvider>
    )
  }
}
