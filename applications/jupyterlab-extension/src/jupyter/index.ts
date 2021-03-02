import { ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application'
import { SessionContext, ICommandPalette, WidgetTracker } from '@jupyterlab/apputils'
import { ILauncher } from '@jupyterlab/launcher'
import { IMainMenu } from '@jupyterlab/mainmenu'
import { ITranslator } from '@jupyterlab/translation'
import { LabIcon } from '@jupyterlab/ui-components'
import { Menu } from '@lumino/widgets'
import { WrapperPanel } from './panel'

import AppIconSvg from './icon.svg'

const AppId = 'dharpa-vre'
const AppLabel = 'DHARPA VRE'
const AppCaption = 'DHARPA VRE'
const AppCategory = 'DHARPA'

/**
 * The command IDs used by the console plugin.
 */
namespace CommandIDs {
  export const create = `${AppId}:create`
}

/**
 * Initialization data for the extension.
 */
const extension: JupyterFrontEndPlugin<WidgetTracker<WrapperPanel>> = {
  id: AppId,
  autoStart: true,
  optional: [ILauncher, ILayoutRestorer],
  requires: [ICommandPalette, IMainMenu, ITranslator],
  activate: activate
}

/**
 * Activate the JupyterLab extension.
 */
function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  mainMenu: IMainMenu,
  translator: ITranslator,
  launcher: ILauncher | null,
  restorer: ILayoutRestorer | null
): WidgetTracker<WrapperPanel> {
  const manager = app.serviceManager
  const { commands, shell } = app
  const category = AppCategory
  const trans = translator.load('jupyterlab')

  const mainPanelTracker = new WidgetTracker<WrapperPanel>({
    namespace: AppId
  })

  // Add launcher
  if (launcher) {
    launcher.add({
      command: CommandIDs.create,
      category: category
    })
  }

  // restore open windows
  if (restorer) {
    void restorer.restore(mainPanelTracker, {
      command: CommandIDs.create,
      name: panel => panel.session.path,
      when: app.serviceManager.ready,
      args: panel => ({
        path: panel.session.path
      })
    })
  }

  // create new panel
  async function createPanel({ path }: { path?: string }): Promise<WrapperPanel> {
    const sessionContext = new SessionContext({
      sessionManager: manager.sessions,
      specsManager: manager.kernelspecs,
      name: AppLabel,
      path,
      kernelPreference: {
        language: 'Python',
        autoStartDefault: true
      }
    })

    const panel = new WrapperPanel(`${AppId}-panel`, AppLabel, sessionContext, translator)
    shell.add(panel, 'main')
    mainPanelTracker.add(panel)

    return panel
  }

  // add menu tab
  const exampleMenu = new Menu({ commands })
  exampleMenu.title.label = trans.__(AppLabel)
  mainMenu.addMenu(exampleMenu)

  // add commands to registry
  commands.addCommand(CommandIDs.create, {
    label: trans.__(AppLabel),
    caption: trans.__(AppCaption),
    icon: new LabIcon({ name: `${AppLabel} icon`, svgstr: AppIconSvg }),
    execute: createPanel
  })

  // add items in command palette and menu
  palette.addItem({ command: CommandIDs.create, category })
  exampleMenu.addItem({ command: CommandIDs.create })

  return mainPanelTracker
}

export default extension
