import { PageConfig } from '@jupyterlab/coreutils'

/**
 * Set Jupyter platform configuration options that may have been
 * overridden by the electron app.
 */
export function prepareConfigData(): void {
  const { __vreJupyterParameters } = (window as unknown) as {
    __vreJupyterParameters?: { [key: string]: string }
  }
  Object.entries(__vreJupyterParameters ?? {}).forEach(([key, value]) => PageConfig.setOption(key, value))
}
