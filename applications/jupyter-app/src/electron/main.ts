import path from 'path'
import crypto from 'crypto'
import { app, BrowserWindow } from 'electron'
import { spawn, ChildProcess } from 'child_process'
import { waitForPort, getFreePort } from './networkUtils'

const AppMainHtmlFile = path.resolve(__dirname, '../webapp/index.html')

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

function startJupyterServerProcess(
  port: number,
  token: string,
  closeHandler: (code: number) => void
): Promise<ChildProcess> {
  const mainFile = path.resolve(__dirname, '../../src/server/main.py')
  const cwd = path.resolve(__dirname, '../..')

  return new Promise((res, rej) => {
    const p = spawn('python', [mainFile], {
      cwd,
      env: {
        ...process.env,
        JUPYTER_PORT_OVERRIDE: String(port),
        JUPYTER_TOKEN: token,
        JUPYTER_ORIGIN_PAT_OVERRIDE: 'file://.*'
      }
    })
    p.on('error', rej)

    p.stdout.on('data', data => console.log(`Jupyter: ${data}`))
    p.stderr.on('data', data => console.error(`Jupyter: ${data}`))
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
      app.quit()
    }
  }

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
    if (serverProcess.exitCode == null) {
      // the server process is still running - we need to exit first.
      event.preventDefault()
      console.log('Stopping server process...')
      isReadyToExit = true
      serverProcess.kill('SIGTERM')
    } else {
      console.log('Exiting...')
    }
  })
}

main()
  .then(() => console.log('App started'))
  .catch(e => {
    console.error('Error occured while starting the app', e)
    process.exit(1)
  })
