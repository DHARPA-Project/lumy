import path from 'path'
import crypto from 'crypto'
import { app, BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import treeKill from 'tree-kill'
import { waitForPort, getFreePort } from './networkUtils'
import { InstallerComm, getRunAppAndArgs, getInstallAppAndArgs } from './installer'
import { setUpUpdater } from './updater'

const AppMainHtmlFile = path.resolve(__dirname, '../webapp/index.html')
const InstallerHtmlFile = path.resolve(__dirname, '../webapp/installer.html')

const DefaultStdoutHandler = (data: unknown) => console.log(`Jupyter: ${data}`)
const DefaultStderrHandler = (data: unknown) => console.error(`Jupyter: ${data}`)

const ForcePowerShell = String(process.env.FORCE_POWERSHELL) === '1'
const SkipCondaRun = String(process.env.SKIP_CONDA) === '1'
const ForceInstall = String(process.env.FORCE_INSTALL) === '1'

function generateToken(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

declare const LUMY_MIDDLEWARE_VERSION: string
const AnyMiddlewareVersion = 'any'

/**
 * Returns required middleware version.
 * Version is resolved in the following order:
 * - contents of the `MIDDLEWARE_VERSION` environmental variable
 * - LUMY_MIDDLEWARE_VERSION variable with the value set by webpack.
 */
function getRequiredMiddlewareVersion(): string | undefined {
  const overriddenVersion =
    process.env['MIDDLEWARE_VERSION'] == null ? '' : process.env['MIDDLEWARE_VERSION'].trim()
  const version = overriddenVersion.length > 0 ? overriddenVersion : LUMY_MIDDLEWARE_VERSION
  if (version === AnyMiddlewareVersion || version.length === 0) return undefined
  return version
}

async function createWindow(port: number, token: string) {
  const win = new BrowserWindow({
    width: 960,
    height: 800,
    show: false,
    webPreferences: {
      additionalArguments: [`--jupyter-baseUrl=http://localhost:${port}/`, `--jupyter-token=${token}`],
      preload: path.join(__dirname, 'preload.js')
    }
  })

  await win.loadFile(AppMainHtmlFile)
  return win
}

async function createInstallerWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 300,
    frame: false,
    transparent: true,
    titleBarStyle: 'customButtonsOnHover',
    // alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'installerPreload.js')
    }
  })

  await win.loadFile(InstallerHtmlFile)
  return win
}

function execute(
  app: string,
  args: string[],
  stdoutHandler: (data: unknown) => void,
  stderrHandler: (data: unknown) => void,
  env?: NodeJS.ProcessEnv
): Promise<number> {
  const spawnEnv = { ...process.env }
  Object.entries(env ?? {}).forEach(([k, v]) => {
    if (k in spawnEnv) {
      if (v == null) {
        delete spawnEnv[k]
      } else {
        spawnEnv[k] = v
      }
    } else {
      spawnEnv[k] = v
    }
  })

  return new Promise((res, rej) => {
    const p = spawn(app, args, {
      env: spawnEnv
    })
    p.on('error', rej)

    p.stdout.on('data', stdoutHandler)
    p.stderr.on('data', stderrHandler)
    p.on('close', res)
  })
}

async function shouldRunInstaller(): Promise<boolean> {
  // if conda is being skipped, do not attempt to run the installer
  if (SkipCondaRun) return false

  const [exe, args] = getRunAppAndArgs('dry-run', ForcePowerShell)
  const installedCheckExitCode = await execute(
    exe,
    args,
    (msg: unknown) => console.log(`[Install check]: ${msg}`),
    (msg: unknown) => console.log(`[Install check] (ERROR): ${msg}`),
    {
      MIDDLEWARE_VERSION: getRequiredMiddlewareVersion()
    }
  )
  return installedCheckExitCode !== 0
}

async function installBackend(
  stdoutHandler: (data: unknown) => void,
  stderrHandler: (data: unknown) => void
): Promise<void> {
  const [exe, args] = getInstallAppAndArgs(ForcePowerShell)
  const installerExitCode = await execute(exe, args, stdoutHandler, stderrHandler, {
    MIDDLEWARE_VERSION: getRequiredMiddlewareVersion()
  })
  if (installerExitCode !== 0) throw new Error(`Installer returned a nonzero exit code: ${installerExitCode}`)
}

function startJupyterServerProcess(
  port: number,
  token: string,
  closeHandler: (code: number) => void,
  stdoutHandler?: (data: unknown) => void,
  stderrHandler?: (data: unknown) => void
): Promise<ChildProcess> {
  const method = SkipCondaRun ? 'skip-conda' : 'default'
  const [exe, args] = getRunAppAndArgs(method, ForcePowerShell)
  const cwd = path.resolve(__dirname, '../..')

  return new Promise((res, rej) => {
    const p = spawn(exe, args, {
      cwd,
      env: {
        ...process.env,
        JUPYTER_PORT_OVERRIDE: String(port),
        JUPYTER_TOKEN: token,
        JUPYTER_ORIGIN_PAT_OVERRIDE: 'file://.*',
        MIDDLEWARE_VERSION: getRequiredMiddlewareVersion()
      }
    })
    p.on('error', rej)

    p.stdout.on('data', stdoutHandler ?? DefaultStdoutHandler)
    p.stderr.on('data', stderrHandler ?? DefaultStderrHandler)
    p.on('close', closeHandler)

    waitForPort({
      host: 'localhost',
      port,
      timeoutMs: 500,
      intervalMs: 100,
      maxWaitMs: 10 * 1000
    })
      .then(() => res(p))
      .catch(e => rej(e))
  })
}

/**
 * Run installer if needed.
 * @return a tuple of:
 *  - browser window if installer did run. Otherwise `undefined`.
 *  - `true` if installation was successful. `false` otherwise.
 */
async function maybeRunInstaller(): Promise<[BrowserWindow | undefined, boolean]> {
  if (!ForceInstall) {
    try {
      const shouldInstall = await shouldRunInstaller()
      if (!shouldInstall) return [undefined, true]
    } catch (e) {
      console.error(`Errors occurred while checking whether installation is needed: ${e}`)
      return [undefined, false]
    }
  }

  const installerWindow = await createInstallerWindow()
  const installerComm = new InstallerComm(installerWindow.webContents)

  try {
    await installBackend(
      installerComm.onStdout.bind(installerComm),
      installerComm.onStderr.bind(installerComm)
    )
    installerComm.finish('ok', 'Installation successfull!')
    return [installerWindow, true]
  } catch (e) {
    installerComm.finish('error', String(e))
    return [installerWindow, false]
  }
}

async function main() {
  await app.whenReady()

  const port = await getFreePort()
  const token = generateToken(32)

  let isReadyToExit = false

  const serverExitedHandler = (code: number) => {
    if (!isReadyToExit) {
      console.warn(
        `Jupyter process exited with code ${code}. ` +
          `We need to inform the user and shutdown the app or restart the server`
      )
    } else {
      console.info('Exiting for real.')
      app.quit()
    }
  }

  let serverProcess: ChildProcess = undefined

  app.on('window-all-closed', () => {
    app.quit()
  })
  app.on('before-quit', event => {
    if (serverProcess != null && serverProcess?.signalCode == null && serverProcess?.exitCode == null) {
      // the server process is still running - we need to exit first.
      event.preventDefault()
      console.log('Stopping server process...')
      isReadyToExit = true

      treeKill(serverProcess?.pid, err => {
        if (err != null) console.error(`Could not kill backend process: ${err}`)
      })
    } else {
      console.log('Exiting...')
      process.exit(0)
    }
  })

  const [installerWindow, installationIsSuccessfull] = await maybeRunInstaller()
  if (installationIsSuccessfull) {
    // wait a second to let the user read the message.
    await new Promise(res => setTimeout(res, 1000))

    console.log('Starting main process')
    serverProcess = await startJupyterServerProcess(port, token, serverExitedHandler)
    console.log('Creating main window')
    const mainWindow = await createWindow(port, token)
    mainWindow.show()
    installerWindow?.destroy()
    console.log('Platform is ready')
    setUpUpdater()
  }
}

main()
  .then(() => console.log('App started'))
  .catch(e => {
    console.error('Error occured while starting the app', e)
    process.exit(1)
  })
