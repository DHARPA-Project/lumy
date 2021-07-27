import * as muiStyles from '@material-ui/styles'

declare global {
  interface Window {
    __lumy_materialUiStyles: typeof muiStyles
  }
}

export function setUpDynamicModulesSupport(): void {
  window['__lumy_materialUiStyles'] = muiStyles
}
