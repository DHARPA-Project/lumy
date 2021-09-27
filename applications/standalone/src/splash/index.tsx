import React from 'react'
import { render } from 'react-dom'
import { SplashScreen, SplashScreenContextProvider } from '@lumy/splash-screen'
import { MockContext } from './mock'

const SplashScreenApp = (): JSX.Element => {
  const context = React.useRef(new MockContext())
  return (
    <SplashScreenContextProvider value={context.current}>
      <SplashScreen title="Lumy" subtitle="Data science research toolkit" />
    </SplashScreenContextProvider>
  )
}

render(<SplashScreenApp />, document.getElementById('root'))
