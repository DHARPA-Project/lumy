// NOTE: code below is needed when application path in `main.py` is not `/`.
// import { PageConfig, URLExt } from '@jupyterlab/coreutils'
// ;((window as unknown) as { __webpack_public_path__: string }).__webpack_public_path__ = URLExt.join(
//   PageConfig.getBaseUrl(),
//   'lumy/'
// )

///<reference types="webpack-env" />
import { prepareConfigData, processTokenFromUrl } from './pageConfig'
import { SessionContext } from '@jupyterlab/apputils'
import { SessionManager, KernelManager, KernelSpecManager, ServiceManager } from '@jupyterlab/services'
import { Widget } from '@lumino/widgets'
import { KernelView, KernelModuleContext } from '@lumy/jupyter-support'

declare global {
  interface Window {
    __lumy_sessionContext?: SessionContext
    __lumy_widget?: KernelView
    __lumy_serviceManager?: ServiceManager.IManager
  }
}

async function main(): Promise<void> {
  prepareConfigData()
  processTokenFromUrl()
  console.log('in main')
  const kernelManager = new KernelManager()
  const specsManager = new KernelSpecManager()
  const sessionManager = new SessionManager({ kernelManager })
  const sessionContext = new SessionContext({
    sessionManager,
    specsManager,
    name: 'Lumy',
    // path is needed to reconnect to the same kernel after page reload.
    path: 'lumy'
  })

  // Use the default kernel.
  sessionContext.kernelPreference = { autoStartDefault: true }

  const serviceManager = new ServiceManager()

  const context = new KernelModuleContext(sessionContext, serviceManager)
  const widget = new KernelView(context)
  Widget.attach(widget, document.body)
  window.__lumy_sessionContext = sessionContext
  window.__lumy_widget = widget
  window.__lumy_serviceManager = serviceManager

  // Start up the kernel.
  void sessionContext.initialize().then(() => {
    console.debug('Jupyter session started')
  })
}

window.addEventListener('load', main)

// support webpack dev server hot reload
if (module.hot) {
  module.hot.accept('@lumy/jupyter-support', function () {
    console.log('reattaching app')
    Widget.detach(window.__lumy_widget)

    const context = new KernelModuleContext(window.__lumy_sessionContext, window.__lumy_serviceManager)
    const widget = new KernelView(context)
    Widget.attach(widget, document.body)
    window.__lumy_widget = widget
  })
}
