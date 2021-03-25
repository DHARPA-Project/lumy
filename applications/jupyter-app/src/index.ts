// NOTE: code below is needed when application path in `main.py` is not `/`.
// import { PageConfig, URLExt } from '@jupyterlab/coreutils'
// ;((window as unknown) as { __webpack_public_path__: string }).__webpack_public_path__ = URLExt.join(
//   PageConfig.getBaseUrl(),
//   'vre/'
// )

///<reference types="webpack-env" />
import { prepareConfigData } from './pageConfig'
import { SessionContext } from '@jupyterlab/apputils'
import { SessionManager, KernelManager, KernelSpecManager, ServiceManager } from '@jupyterlab/services'
import { Widget } from '@lumino/widgets'
import { KernelView, KernelModuleContext } from '@dharpa-vre/jupyter-support'

declare global {
  interface Window {
    __vre_sessionContext?: SessionContext
    __vre_widget?: KernelView
    __vre_serviceManager?: ServiceManager.IManager
  }
}

async function main(): Promise<void> {
  prepareConfigData()
  const kernelManager = new KernelManager()
  const specsManager = new KernelSpecManager()
  const sessionManager = new SessionManager({ kernelManager })
  const sessionContext = new SessionContext({
    sessionManager,
    specsManager,
    name: 'VRE',
    // path is needed to reconnect to the same kernel after page reload.
    path: 'dharpa_vre'
  })

  // Use the default kernel.
  sessionContext.kernelPreference = { autoStartDefault: true }

  const serviceManager = new ServiceManager()

  const context = new KernelModuleContext(sessionContext, serviceManager)
  const widget = new KernelView(context)
  Widget.attach(widget, document.body)
  window.__vre_sessionContext = sessionContext
  window.__vre_widget = widget
  window.__vre_serviceManager = serviceManager

  // Start up the kernel.
  void sessionContext.initialize().then(() => {
    console.debug('Jupyter session started')
  })
}

window.addEventListener('load', main)

// support webpack dev server hot reload
if (module.hot) {
  module.hot.accept('@dharpa-vre/jupyter-support', function () {
    console.log('reattaching app')
    Widget.detach(window.__vre_widget)

    const context = new KernelModuleContext(window.__vre_sessionContext, window.__vre_serviceManager)
    const widget = new KernelView(context)
    Widget.attach(widget, document.body)
    window.__vre_widget = widget
  })
}
