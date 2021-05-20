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
