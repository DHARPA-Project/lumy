import { Menu } from 'electron'
import { autoUpdater } from 'electron-updater'
import { getMenu, MenuProps } from './components/appMenu'

export enum UpdateState {
  NotAvailable,
  Checking,
  Available,
  Downloading,
  Downloaded
}

const UpdateStateLabel: Record<UpdateState, string> = {
  [UpdateState.NotAvailable]: 'Check for Updates...',
  [UpdateState.Checking]: 'Checking if updates are available...',
  [UpdateState.Available]: 'Updates available. Click to Download...',
  [UpdateState.Downloading]: 'Downloading Updates...',
  [UpdateState.Downloaded]: 'Updates Downloaded. Click to install and restart...'
}

/**
 * Application updater. Handles app updates. Update main app menu
 * with respective status.
 */
class ApplicationUpdater {
  updateState = UpdateState.NotAvailable

  constructor() {
    autoUpdater.autoDownload = false
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.allowPrerelease = true

    this.setState(UpdateState.NotAvailable)
    autoUpdater.on('checking-for-update', () => this.setState(UpdateState.Checking))
    autoUpdater.on('update-available', () => this.setState(UpdateState.Available))
    autoUpdater.on('update-not-available', () => this.setState(UpdateState.NotAvailable))
    autoUpdater.on('update-downloaded', () => this.setState(UpdateState.Downloaded))
    autoUpdater.on('download-progress', () => this.setState(UpdateState.Downloading))
    autoUpdater.on('error', (error: Error) => {
      this.setState(UpdateState.NotAvailable)
      this.reportError(error)
    })
    // check updates right away
    this.checkUpdates()
  }

  setState(updateState: UpdateState) {
    this.updateState = updateState
    Menu.setApplicationMenu(getMenu({ updateMenuItem: this.getMenuItem() }))
  }

  getMenuItem(): MenuProps['updateMenuItem'] {
    return {
      label: UpdateStateLabel[this.updateState],
      click: () => this._updateClickHandler(this.updateState)
    }
  }

  _updateClickHandler(state: UpdateState) {
    switch (state) {
      case UpdateState.NotAvailable:
        this.checkUpdates()
        break
      case UpdateState.Available:
        this.dowloadUpdates()
        break
      case UpdateState.Downloaded:
        this.installUpdates()
      default:
        break
    }
  }
  reportError(error: Error) {
    console.error(`An error occurred while checking for updates: ${error}`)
  }

  checkUpdates() {
    autoUpdater.checkForUpdates()
  }
  dowloadUpdates() {
    autoUpdater.downloadUpdate()
  }
  installUpdates() {
    autoUpdater.quitAndInstall()
  }
}

let applicationUpdater: ApplicationUpdater = undefined

export function setUpUpdater(): ApplicationUpdater {
  if (applicationUpdater == null) {
    applicationUpdater = new ApplicationUpdater()
  }
  return applicationUpdater
}
