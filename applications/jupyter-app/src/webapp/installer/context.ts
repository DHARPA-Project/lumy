import { FinishMessage, ISplashScreenContext } from '@dharpa-vre/splash-screen'

const ChannelMap = {
  default: 'stdoutMessage',
  error: 'stderrMessage'
}
const FinishMessageChannel = 'installationComplete'

type Listener<T> = (event: Event, msg: T) => void
interface IComm {
  on<T>(channel: string, cb: Listener<T>): void
  off<T>(channel: string, cb: Listener<T>): void
}

declare global {
  interface Window {
    comm: IComm
  }
}

const { comm } = window

export class ElectronContext implements ISplashScreenContext {
  _defaultItems: string[] = []
  _errorItems: string[] = []
  _finishMessage: FinishMessage

  onStreamItemsUpdated(type: 'default' | 'error', callback: (value: string[]) => void): () => void {
    const channelId = ChannelMap[type]
    if (channelId == null) throw new Error(`Unknown type: ${type}`)

    const items = type === 'error' ? this._errorItems : this._defaultItems
    const handler = (_: Event, message: string) => {
      console.log('A', message)
      items.push(message)
      callback(items)
    }
    comm.on(channelId, handler)
    return () => comm.off(channelId, handler)
  }
  onFinishMessageAvailable(callback: (value: FinishMessage) => void): () => void {
    const handler = (_: Event, message: FinishMessage) => {
      console.log('B', message)
      this._finishMessage = message
      callback(this._finishMessage)
    }
    comm.on(FinishMessageChannel, handler)
    return () => comm.off(FinishMessageChannel, handler)
  }
}
