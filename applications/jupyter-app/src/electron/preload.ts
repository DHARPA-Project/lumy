import { contextBridge } from 'electron'

/**
 * Get jupyter related configuration options from the arguments
 * and expose them in the page context as a global variable
 * that can be picked up and added to the Jupyter `pageConfig`
 * by the page JS code.
 */
function getJupyterParameters(): { [key: string]: string } {
  return process.argv
    .filter(s => s.startsWith('--jupyter-'))
    .reduce((acc, s) => {
      const [key, value] = s.replace('--jupyter-', '').split('=')
      return { ...acc, [key]: value }
    }, {}) as { [key: string]: string }
}

contextBridge.exposeInMainWorld('__lumyJupyterParameters', getJupyterParameters())
