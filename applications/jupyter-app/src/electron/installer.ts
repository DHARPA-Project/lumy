import { ipcMain } from 'electron'
import { FinishMessage } from '@dharpa-vre/splash-screen'

const StdoutChannel = 'stdoutMessage'
const StderrChannel = 'stderrMessage'
const FinishMessageChannel = 'installationComplete'

export class InstallerComm {
  onStdout(msg: unknown): void {
    console.log(`Installer: ${msg}`)
    ipcMain.emit(StdoutChannel, msg)
  }
  onStderr(msg: unknown): void {
    console.error(`Installer [ERROR]: ${msg}`)
    ipcMain.emit(StderrChannel, msg)
  }
  finish(type: FinishMessage['type'], text: string): void {
    ipcMain.emit(FinishMessageChannel, {
      type,
      text
    })
  }
}
