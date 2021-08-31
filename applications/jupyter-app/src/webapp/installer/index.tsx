import React from 'react'
import { render } from 'react-dom'
import { SplashScreen, SplashScreenContextProvider } from '@lumy/splash-screen'
import { ElectronContext } from './context'

const SplashScreenApp = (): JSX.Element => {
  const context = React.useRef(new ElectronContext())

  const handleLogToggle = (isExpaned: boolean) => {
    if (isExpaned) window.resizeTo(700, 600)
    else window.resizeTo(700, 300)
  }
  return (
    <SplashScreenContextProvider value={context.current}>
      <SplashScreen
        title="Lumy"
        subtitle="Hang tight, installing dependencies"
        onLogToggle={handleLogToggle}
      />
    </SplashScreenContextProvider>
  )
}

render(<SplashScreenApp />, document.getElementById('root'))
