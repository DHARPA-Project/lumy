import path from 'path'
import crypto from 'crypto'
import { app, BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import treeKill from 'tree-kill'
import { waitForPort, getFreePort } from './networkUtils'
import { InstallerComm } from './installer'

const AppMainHtmlFile = path.resolve(__dirname, '../webapp/index.html')
const InstallerHtmlFile = path.resolve(__dirname, '../webapp/installer.html')

const DefaultStdoutHandler = (data: unknown) => console.log(`Jupyter: ${data}`)
const DefaultStderrHandler = (data: unknown) => console.error(`Jupyter: ${data}`)

const getRunScript = (): string => {
  const getPath = (filename: string) => path.resolve(__dirname, `../../src/server/scripts/run/${filename}`)
  switch (process.platform) {
    case 'darwin':
      return getPath('mac.sh')
    case 'win32':
      throw new Error('No start script for windows yet.')
    default:
      throw new Error('No start script for *nix yet.')
  }
}

const getInstallScript = (): string => {
  const getPath = (filename: string) =>
    path.resolve(__dirname, `../../src/server/scripts/install/${filename}`)
  switch (process.platform) {
    case 'darwin':
      return getPath('mac.sh')
    case 'win32':
      throw new Error('No start script for windows yet.')
    default:
      throw new Error('No start script for *nix yet.')
  }
}

function generateToken(length: number): string {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

async function createWindow(port: number, token: string) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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
    width: 600,
    height: 400,
    frame: false,
    transparent: true,
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
  stderrHandler: (data: unknown) => void
): Promise<number> {
  return new Promise((res, rej) => {
    const p = spawn(app, args)
    p.on('error', rej)

    p.stdout.on('data', stdoutHandler)
    p.stderr.on('data', stderrHandler)
    p.on('close', res)
  })
}

async function shouldRunInstaller(): Promise<boolean> {
  const installedCheckExitCode = await execute(
    getRunScript(),
    ['--dry-run'],
    (msg: unknown) => console.log(`[Install check]: ${msg}`),
    (msg: unknown) => console.log(`[Install check] (ERROR): ${msg}`)
  )
  return installedCheckExitCode !== 0
}

async function installBackend(
  stdoutHandler: (data: unknown) => void,
  stderrHandler: (data: unknown) => void
): Promise<void> {
  const installerExitCode = await execute(getInstallScript(), [], stdoutHandler, stderrHandler)
  if (installerExitCode !== 0) throw new Error(`Installer returned a nonzero exit code: ${installerExitCode}`)
}

function startJupyterServerProcess(
  port: number,
  token: string,
  closeHandler: (code: number) => void,
  stdoutHandler?: (data: unknown) => void,
  stderrHandler?: (data: unknown) => void
): Promise<ChildProcess> {
  const mainFile = getRunScript()
  const cwd = path.resolve(__dirname, '../..')
  const args = String(process.env.SKIP_CONDA) === '1' ? ['--skip-conda'] : []

  return new Promise((res, rej) => {
    const p = spawn(mainFile, args, {
      cwd,
      env: {
        ...process.env,
        JUPYTER_PORT_OVERRIDE: String(port),
        JUPYTER_TOKEN: token,
        JUPYTER_ORIGIN_PAT_OVERRIDE: 'file://.*'
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
  const forceInstall = String(process.env.FORCE_INSTALL) === '1'
  if (forceInstall) return [undefined, true]

  try {
    const shouldInstall = await shouldRunInstaller()
    if (!shouldInstall) return [undefined, true]
  } catch (e) {
    console.error(`Errors occurred while checking whether installation is needed: ${e}`)
    return [undefined, false]
  }

  const installerWindow = await createInstallerWindow()
  const installerComm = new InstallerComm(installerWindow.webContents)

  try {
    await installBackend(
      installerComm.onStdout.bind(installerComm),
      installerComm.onStderr.bind(installerComm)
    )
    installerComm.finish('ok', 'Installation successfull')
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

  const [installerWindow, installationIsSuccessfull] = await maybeRunInstaller()
  if (installationIsSuccessfull) {
    // wait a second to let the user read the message.
    await new Promise(res => setTimeout(res, 1000))

    serverProcess = await startJupyterServerProcess(port, token, serverExitedHandler)
    const mainWindow = await createWindow(port, token)
    mainWindow.show()
    installerWindow?.destroy()
  }

  app.on('window-all-closed', () => {
    app.quit()
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port, token)
    }
  })
  app.on('before-quit', event => {
    if (serverProcess != null && serverProcess?.signalCode == null) {
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
}

main()
  .then(() => console.log('App started'))
  .catch(e => {
    console.error('Error occured while starting the app', e)
    process.exit(1)
  })
