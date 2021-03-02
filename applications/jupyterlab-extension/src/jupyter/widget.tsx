import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { KernelModuleContext } from './kernelContext'
import { ModuleContextProvider, useBackendIsReady } from '@dharpa-vre/client-core'

const centeredStyle = {
  'text-align': 'center',
  marginTop: '30%',
  fontWeight: 100,
  fontSize: '2rem'
}

/**
 * VRE entry point
 */
const App = () => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <p style={centeredStyle}>↻ Backend is starting...</p>

  return <p style={centeredStyle}>✔ VRE will be rendered here</p>
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
