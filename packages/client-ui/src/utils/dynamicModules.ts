import * as muiStyles from '@material-ui/styles'
import * as muiCoreStyles from '@material-ui/core/styles'
import * as muiCore from '@material-ui/core'

/**
 * Dependencies that should be available in the global variable space
 * for the dynamic modules that are not bundled with them.
 */
declare global {
  interface Window {
    /* Both styles dependencies need to be shared
       between Lumy and the dynamic modules in order for
       the Lumy MUI theme React context to be available
       for the dynameic modules. Without it, they will
       use default Material UI style
    */
    __lumy_materialUiStyles: typeof muiStyles
    __lumy_materialUiCoreStyles: typeof muiCoreStyles
    /* MUI core is made available just to let the dynamic
       modules developers a chance to make their module file
       smaller by not bundling it with the MUI core code. */
    __lumy_materialUiCore: typeof muiCore
  }
}

export function setUpDynamicModulesSupport(): void {
  window['__lumy_materialUiStyles'] = muiStyles
  window['__lumy_materialUiCore'] = muiCore
  window['__lumy_materialUiCoreStyles'] = muiCoreStyles
}
