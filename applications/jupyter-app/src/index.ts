// NOTE: code below is needed when application path in `main.py` is not `/`.
// import { PageConfig, URLExt } from '@jupyterlab/coreutils'
// ;((window as unknown) as { __webpack_public_path__: string }).__webpack_public_path__ = URLExt.join(
//   PageConfig.getBaseUrl(),
//   'vre/'
// )

import { SessionContext } from '@jupyterlab/apputils'
import { SessionManager, KernelManager, KernelSpecManager } from '@jupyterlab/services'
import { Widget } from '@lumino/widgets'
import { KernelView, KernelModuleContext } from '@dharpa-vre/jupyter-support'

function main(): void {
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

  const context = new KernelModuleContext(sessionContext)
  const widget = new KernelView(context)
  Widget.attach(widget, document.body)
  ;(window as any).__vre_sessionContext = sessionContext
  ;(window as any).__vre_widget = widget

  // Start up the kernel.
  void sessionContext.initialize().then(() => {
    console.debug('Jupyter session started')
  })
}

window.addEventListener('load', main)

// support webpack dev server hot reload
if ((module as any).hot) {
  ;(module as any).hot.accept('@dharpa-vre/jupyter-support', function () {
    console.log('reattaching app')
    Widget.detach((window as any).__vre_widget)

    const context = new KernelModuleContext((window as any).__vre_sessionContext)
    const widget = new KernelView(context)
    Widget.attach(widget, document.body)
    ;(window as any).__vre_widget = widget
  })
}
