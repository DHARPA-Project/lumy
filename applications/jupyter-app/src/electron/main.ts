import path from 'path'
import crypto from 'crypto'
import { app, BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import treeKill from 'tree-kill'
import { waitForPort, getFreePort } from './networkUtils'

const AppMainHtmlFile = path.resolve(__dirname, '../webapp/index.html')

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

function createWindow(port: number, token: string) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      additionalArguments: [`--jupyter-baseUrl=http://localhost:${port}/`, `--jupyter-token=${token}`],
      preload: path.join(__dirname, 'preload.js')
    }
  })

  return win.loadFile(AppMainHtmlFile)
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

async function installBackend(
  stdoutHandler: (data: unknown) => void,
  stderrHandler: (data: unknown) => void,
  forceInstall = false
): Promise<void> {
  const installedCheckExitCode = await execute(getRunScript(), ['--check-env'], stdoutHandler, stderrHandler)
  if (installedCheckExitCode !== 0 || forceInstall) {
    const installerExitCode = await execute(getInstallScript(), [], stdoutHandler, stderrHandler)
    if (installerExitCode !== 0)
      throw new Error(`Installer returned a nonzero exit code: ${installerExitCode}`)
  }
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

  await installBackend(
    data => console.log(`Installer: ${data}`),
    data => console.error(`Installer: ${data}`)
  )

  const serverProcess = await startJupyterServerProcess(port, token, serverExitedHandler)
  await createWindow(port, token)

  app.on('window-all-closed', () => {
    app.quit()
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port, token)
    }
  })
  app.on('before-quit', event => {
    if (serverProcess.signalCode == null) {
      // the server process is still running - we need to exit first.
      event.preventDefault()
      console.log('Stopping server process...')
      isReadyToExit = true

      treeKill(serverProcess.pid, err => {
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
