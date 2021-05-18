import { Signal } from '@lumino/signaling'
import { FinishMessage, ISplashScreenContext } from '@dharpa-vre/splash-screen'

const lipsum = `Lorem, ipsum dolor sit amet consectetur
adipisicing elit. Alias hic consequuntur commodi possimus
unde nemo quis explicabo earum vel id! Molestias omnis
facere consequatur aliquam, id impedit cupiditate tempore sit?
`
const getTestMessage = () => `${new Date()}: ${lipsum}`

export class MockContext implements ISplashScreenContext {
  _defaultStreamItems: string[] = []
  _errorStreamItems: string[] = []
  _finishMessage?: FinishMessage

  _defaultStreamItemsUpdated = new Signal<MockContext, string[]>(this)
  _errorStreamItemsUpdated = new Signal<MockContext, string[]>(this)
  _finishMessageAvailable = new Signal<MockContext, FinishMessage>(this)

  constructor() {
    const defaultInterval = setInterval(() => {
      this._defaultStreamItems = this._defaultStreamItems.concat([getTestMessage()])
      this._defaultStreamItemsUpdated.emit(this._defaultStreamItems)
    }, 1000)
    const errorInterval = setInterval(() => {
      this._errorStreamItems = this._errorStreamItems.concat([getTestMessage()])
      this._errorStreamItemsUpdated.emit(this._errorStreamItems)
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
  onStreamItemsUpdated(type: 'error' | 'default', callback: (value: string[]) => void): () => void {
    callback(type === 'error' ? this._errorStreamItems : this._defaultStreamItems)
    const signal = type === 'error' ? this._errorStreamItemsUpdated : this._defaultStreamItemsUpdated
    const handler = (_: unknown, items: string[]) => callback(items)
    signal.connect(handler)
    return () => signal.disconnect(handler)
  }
  onFinishMessageAvailable(callback: (value: FinishMessage) => void): () => void {
    if (this._finishMessage != null) callback(this._finishMessage)
    const handler = (_: unknown, msg: FinishMessage) => callback(msg)
    this._finishMessageAvailable.connect(handler)
    return () => this._finishMessageAvailable.disconnect(handler)
  }
}
