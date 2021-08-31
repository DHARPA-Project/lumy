import { FinishMessage, ISplashScreenContext, StreamMessage } from '@lumy/splash-screen'

const StreamMessageChannel = 'streamMessage'
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
  _items: StreamMessage[] = []
  _finishMessage: FinishMessage

  onStreamItemsUpdated(callback: (value: StreamMessage[]) => void): () => void {
    const handler = (_: Event, message: StreamMessage) => {
      this._items = this._items.concat([message])
      callback(this._items)
    }
    comm.on(StreamMessageChannel, handler)
    return () => comm.off(StreamMessageChannel, handler)
  }
  onFinishMessageAvailable(callback: (value: FinishMessage) => void): () => void {
    const handler = (_: Event, message: FinishMessage) => {
      this._finishMessage = message
      callback(this._finishMessage)
    }
    comm.on(FinishMessageChannel, handler)
    return () => comm.off(FinishMessageChannel, handler)
  }
}
