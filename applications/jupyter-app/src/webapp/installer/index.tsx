import React from 'react'
import { render } from 'react-dom'
import { SplashScreen, SplashScreenContextProvider } from '@lumy/splash-screen'
import { ElectronContext } from './context'

const SplashScreenApp = (): JSX.Element => {
  const context = React.useRef(new ElectronContext())

  return (
    <SplashScreenContextProvider value={context.current}>
      <SplashScreen title="Lumy" subtitle="Data science research toolkit" />
    </SplashScreenContextProvider>
  )
}

render(<SplashScreenApp />, document.getElementById('root'))
