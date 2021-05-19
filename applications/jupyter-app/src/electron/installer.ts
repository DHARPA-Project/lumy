import { WebContents } from 'electron'
import { FinishMessage } from '@dharpa-vre/splash-screen'

const StdoutChannel = 'stdoutMessage'
const StderrChannel = 'stderrMessage'
const FinishMessageChannel = 'installationComplete'

export class InstallerComm {
  _webContents: WebContents
  _hasErrors = false

  constructor(webContents: WebContents) {
    this._webContents = webContents
  }

  onStdout(msg: unknown): void {
    console.log(`Installer: ${msg}`)
    this._webContents.send(StdoutChannel, { message: String(msg) })
  }
  onStderr(msg: unknown): void {
    console.error(`Installer [ERROR]: ${msg}`)
    this._hasErrors = true
    this._webContents.send(StderrChannel, { message: String(msg) })
  }
  finish(type: FinishMessage['type'], text: string): void {
    console.log(`Installation ${type}: ${text}`)
    this._webContents.send(FinishMessageChannel, {
      type,
      text
    })
  }
  get hasError(): boolean {
    return this._hasErrors
  }
}
