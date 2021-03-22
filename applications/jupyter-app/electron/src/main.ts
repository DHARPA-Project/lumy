import path from 'path'
import { app, BrowserWindow } from 'electron'
import { spawn } from 'child_process'

const port = 12345
const token = '12345abcde'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      additionalArguments: [`--jupyter-baseUrl=http://localhost:${port}/`, `--jupyter-token=${token}`],
      preload: path.join(__dirname, 'preload.js')
    }
  })

  return win.loadFile('../src/index.html')
}

function startJupyterServerProcess(closeHandler: (code: number) => void) {
  const mainFile = path.resolve(__dirname, '../../main.py')
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
    // p.on('spawn', () => res(p))
    p.on('error', rej)

    p.stdout.on('data', data => console.log(`Jupyter: ${data}`))
    p.stderr.on('data', data => console.error(`Jupyter: ${data}`))
    p.on('close', closeHandler)

    // TODO: poll the API address (see `port`) until it is up,
    // then resolve the promise.
    setTimeout(() => res(p), 2000)
    res(p)
  })
}

app
  .whenReady()
  .then(() =>
    startJupyterServerProcess(code => {
      console.warn(
        `Jupyter process exited with code ${code}. We need to inform the user and shutdown or restart`
      )
    })
  )
  .then(() => {
    createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
