import { Signal } from '@lumino/signaling'
import { FinishMessage, ISplashScreenContext, StreamMessage } from '@lumy/splash-screen'

const lipsum = `Lorem, ipsum dolor sit amet consectetur
adipisicing elit. Alias hic consequuntur commodi possimus
unde nemo quis explicabo earum vel id! Molestias omnis
facere consequatur aliquam, id impedit cupiditate tempore sit?
`
const getTestMessage = () => `${new Date()}: ${lipsum}`

export class MockContext implements ISplashScreenContext {
  _streamItems: StreamMessage[] = []
  _finishMessage?: FinishMessage

  _streamItemsUpdated = new Signal<MockContext, StreamMessage[]>(this)
  _finishMessageAvailable = new Signal<MockContext, FinishMessage>(this)

  constructor() {
    const defaultInterval = setInterval(() => {
      this._streamItems = this._streamItems.concat([
        {
          type: 'info',
          text: getTestMessage()
        }
      ])
      this._streamItemsUpdated.emit(this._streamItems)
    }, 1000)
    const errorInterval = setInterval(() => {
      this._streamItems = this._streamItems.concat([
        {
          type: 'error',
          text: getTestMessage()
        }
      ])
      this._streamItemsUpdated.emit(this._streamItems)
    }, 3000)
    setTimeout(() => {
      clearInterval(defaultInterval)
      clearInterval(errorInterval)
      this._finishMessage = {
        text: lipsum,
        type: Math.random() > 0.5 ? 'error' : 'ok'
      }
      this._finishMessageAvailable.emit(this._finishMessage)
    }, 7000)
  }
  onStreamItemsUpdated(callback: (value: StreamMessage[]) => void): () => void {
    callback(this._streamItems)
    const handler = (_: unknown, items: StreamMessage[]) => callback(items)
    this._streamItemsUpdated.connect(handler)
    return () => this._streamItemsUpdated.disconnect(handler)
  }
  onFinishMessageAvailable(callback: (value: FinishMessage) => void): () => void {
    if (this._finishMessage != null) callback(this._finishMessage)
    const handler = (_: unknown, msg: FinishMessage) => callback(msg)
    this._finishMessageAvailable.connect(handler)
    return () => this._finishMessageAvailable.disconnect(handler)
  }
}
