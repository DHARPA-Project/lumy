import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { KernelModuleContext } from './kernelContext'
import { BackEndContextProvider, useBackendIsReady } from '@dharpa-vre/client-core'
import { App } from '@dharpa-vre/client-ui'

const centeredStyle = {
  'text-align': 'center',
  marginTop: '30%',
  fontWeight: 100,
  fontSize: '2rem'
}

/**
 * VRE entry point
 */
const BackEndAvailabilityScreen = () => {
  const backendIsReady = useBackendIsReady()

  if (!backendIsReady) return <p style={centeredStyle}>↻ Backend is starting...</p>

  return <App />
}

export class KernelView extends ReactWidget {
  private _context: KernelModuleContext

  constructor(context: KernelModuleContext) {
    super()
    this._context = context
  }

  protected render(): React.ReactElement<unknown> {
    return (
      <BackEndContextProvider value={this._context}>
        <BackEndAvailabilityScreen />
      </BackEndContextProvider>
    )
  }
}
