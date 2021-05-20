import { ipcRenderer, contextBridge } from 'electron'

type Listener<T> = (event: Event, msg: T) => void
interface IComm {
  on<T>(channel: string, cb: Listener<T>): void
  off<T>(channel: string, cb: Listener<T>): void
}

const comm: IComm = {
  on<T>(channel: string, cb: Listener<T>): void {
    ipcRenderer.on(channel, cb)
  },
  off<T>(channel: string, cb: Listener<T>): void {
    ipcRenderer.off(channel, cb)
  }
}

contextBridge.exposeInMainWorld('comm', comm)
