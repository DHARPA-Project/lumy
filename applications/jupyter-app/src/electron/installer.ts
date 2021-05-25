import path from 'path'
import { WebContents } from 'electron'
import { FinishMessage, StreamMessage } from '@dharpa-vre/splash-screen'

const StreamMessageChannel = 'streamMessage'
const FinishMessageChannel = 'installationComplete'

export class InstallerComm {
  _webContents: WebContents

  constructor(webContents: WebContents) {
    this._webContents = webContents
  }

  onStdout(msg: unknown): void {
    console.log(`Installer [INFO]: ${msg}`)
    const message: StreamMessage = { text: String(msg), type: 'info' }
    this._webContents.send(StreamMessageChannel, message)
  }
  onStderr(msg: unknown): void {
    console.error(`Installer [ERROR]: ${msg}`)
    const message: StreamMessage = { text: String(msg), type: 'error' }
    this._webContents.send(StreamMessageChannel, message)
  }
  finish(type: FinishMessage['type'], text: string): void {
    console.log(`Installation ${type}: ${text}`)
    this._webContents.send(FinishMessageChannel, {
      type,
      text
    })
  }
}

const getRunScript = (forcePowerShell = false): string => {
  const getPath = (filename: string) => path.resolve(__dirname, `../../src/server/scripts/run/${filename}`)
  switch (process.platform) {
    case 'darwin':
      return forcePowerShell ? getPath('win.ps1') : getPath('macnix.sh')
    case 'win32':
      return getPath('win.ps1')
    default:
      return getPath('macnix.sh')
  }
}

const getInstallScript = (forcePowerShell = false): string => {
  const getPath = (filename: string) =>
    path.resolve(__dirname, `../../src/server/scripts/install/${filename}`)
  switch (process.platform) {
    case 'darwin':
      return forcePowerShell ? getPath('win.ps1') : getPath('macnix.sh')
    case 'win32':
      return getPath('win.ps1')
    default:
      return getPath('macnix.sh')
  }
}

const getExecutable = (forcePowerShell = false): [string, string[]] => {
  switch (process.platform) {
    case 'darwin':
      return forcePowerShell ? ['pwsh', ['-ExecutionPolicy', 'Bypass']] : ['bash', []]
    case 'win32':
      return ['powershell.exe', ['-ExecutionPolicy', 'Bypass']]
    default:
      throw new Error('No start script for *nix yet.')
  }
}

export const getRunAppAndArgs = (
  method: 'default' | 'dry-run' | 'skip-conda',
  forcePowerShell = false
): [string, string[]] => {
  const runScript = getRunScript(forcePowerShell)
  let args: string[] = []
  switch (method) {
    case 'dry-run':
      args = ['--dry-run']
      break
    case 'skip-conda':
      args = ['--skip-conda']
      break
    default:
      args = []
  }
  const [executable, executableArgs] = getExecutable(forcePowerShell)
  return [executable, executableArgs.concat([runScript].concat(args))]
}

export const getInstallAppAndArgs = (forcePowerShell = false): [string, string[]] => {
  const runScript = getInstallScript(forcePowerShell)
  const [executable, executableArgs] = getExecutable(forcePowerShell)
  return [executable, executableArgs.concat([runScript])]
}
