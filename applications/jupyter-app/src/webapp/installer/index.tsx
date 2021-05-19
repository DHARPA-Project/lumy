import React from 'react'
import { render } from 'react-dom'
import { SplashScreen, SplashScreenContextProvider } from '@dharpa-vre/splash-screen'
import { ElectronContext } from './context'

const SplashScreenApp = (): JSX.Element => {
  const context = React.useRef(new ElectronContext())
  return (
    <SplashScreenContextProvider value={context.current}>
      <SplashScreen title="Preparing VRE" />
    </SplashScreenContextProvider>
  )
}

render(<SplashScreenApp />, document.getElementById('root'))
