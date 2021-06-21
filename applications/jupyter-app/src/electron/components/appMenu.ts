import { app, Menu, MenuItem, MenuItemConstructorOptions } from 'electron'

const isMac = process.platform === 'darwin'

export interface MenuProps {
  updateMenuItem?: { label: string; click: () => void }
}

export function getMenu(props: MenuProps): Menu {
  const menuItems: (MenuItem | MenuItemConstructorOptions)[] = [
    getMainMenu(props),
    { role: 'fileMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    getHelpMenu(props)
  ]
  return Menu.buildFromTemplate(menuItems.filter(item => item != null))
}

function getMainMenu({ updateMenuItem }: MenuProps): MenuItem | MenuItemConstructorOptions {
  if (!isMac) return
  // Mac only
  return {
    label: app.name,
    submenu: [{ role: 'about' }, updateMenuItem, { type: 'separator' }, { role: 'quit' }].filter(
      i => i != null
    ) as MenuItemConstructorOptions[]
  }
}

function getHelpMenu({ updateMenuItem }: MenuProps): MenuItem | MenuItemConstructorOptions {
  if (isMac) return { role: 'help' }

  // Everything except Mac (where it is already handled in Mac main menu)
  return {
    role: 'help',
    submenu: [updateMenuItem].filter(i => i != null) as MenuItemConstructorOptions[]
  }
}
