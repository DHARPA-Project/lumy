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

export function processTokenFromUrl(): void {
  const parsedUrl = new URL(window.location.href)
  const token = parsedUrl.searchParams.get('token')

  if (token == null) return

  PageConfig.setOption('token', token)

  parsedUrl.searchParams.delete('token')
  window.history.replaceState({}, '', parsedUrl.href)
}
