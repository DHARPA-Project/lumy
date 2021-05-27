import React, { useState, createContext } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import { createMuiTheme, MuiThemeProvider, Theme } from '@material-ui/core/styles'
import { PaletteType, ThemeOptions } from '@material-ui/core'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    layout: {
      sideBarFullWidth: React.CSSProperties['width']
      sideBarCollapsedWidth: React.CSSProperties['width']
      navLinkTextWidth: React.CSSProperties['width']
      toolBarWidth: React.CSSProperties['width']
      navBarTop: React.CSSProperties['height']
      navBarBottom: React.CSSProperties['height']
      pagePadding: React.CSSProperties['padding']
      toolContainerWidth: React.CSSProperties['width']
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    layout?: {
      sideBarFullWidth?: React.CSSProperties['width']
      sideBarCollapsedWidth?: React.CSSProperties['width']
      navLinkTextWidth: React.CSSProperties['width']
      toolBarWidth: React.CSSProperties['width']
      navBarTop: React.CSSProperties['height']
      navBarBottom: React.CSSProperties['height']
      pagePadding: React.CSSProperties['padding']
      toolContainerWidth: React.CSSProperties['width']
    }
  }
}

export type ThemeContextType = {
  darkModeEnabled: boolean
  toggleDarkMode: () => void
  sidebarTheme: Theme
}

type ThemeContextProviderProps = {
  children?: React.ReactNode
}

export const ThemeContext = createContext<ThemeContextType>(null)

const defaultTheme = createMuiTheme()

const getThemeFromLocalStorage = () => {
  const valueInLocalStorage = localStorage.getItem('darkModeEnabled')
  return valueInLocalStorage ? JSON.parse(valueInLocalStorage) : false
}

const ThemeContextProvider = ({ children }: ThemeContextProviderProps): JSX.Element => {
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(getThemeFromLocalStorage)

  const toggleDarkMode = () => {
    setDarkModeEnabled(previousMode => {
      localStorage.setItem('darkModeEnabled', JSON.stringify(!previousMode))
      return !previousMode
    })
  }

  /**
   * Shallow-merge additional options on top of default options to create custom MUI themes
   * @param extendedOptions object containing default Material UI theme options
   * @returns extended Material UI theme object
   */
  const createCustomTheme = (extendedOptions?: ThemeOptions) =>
    createMuiTheme({
      palette: {
        type: darkModeEnabled ? ('dark' as PaletteType) : ('light' as PaletteType)
      },
      typography: {
        body1: {
          fontSize: '0.75rem',
          lineHeight: 1.35
        },
        body2: {
          fontSize: '0.75rem',
          lineHeight: 1.35
        },
        subtitle1: {
          fontSize: '0.875rem',
          lineHeight: 1.5
        }
      },
      props: {
        MuiSvgIcon: {
          fontSize: 'small'
        }
      },
      layout: {
        sideBarFullWidth: '200px',
        sideBarCollapsedWidth: '40px',
        navLinkTextWidth: 90,
        toolBarWidth: '50px',
        navBarTop: '20vh',
        navBarBottom: '10vh',
        pagePadding: '1.5rem',
        toolContainerWidth: '50vw'
      },
      overrides: {
        MuiTableCell: {
          root: {
            padding: defaultTheme.spacing(1)
          }
        },
        MuiTablePagination: {
          root: {
            fontSize: '0.75rem'
          }
        }
      },
      ...extendedOptions
    })

  // Keep in mind that createCustomTheme() performs a shallow merge...
  // ... of default option and extended option objects; deeply nested properties...
  // ... of default theme may be lost if not copied over to extended option object
  const globalTheme = createCustomTheme()
  const sidebarTheme = createCustomTheme({
    palette: {
      type: 'dark',
      background: {
        paper: '#222A45',
        default: '#1a2038'
      }
    }
  })

  return (
    <ThemeContext.Provider value={{ darkModeEnabled, toggleDarkMode, sidebarTheme }}>
      <MuiThemeProvider theme={globalTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider
