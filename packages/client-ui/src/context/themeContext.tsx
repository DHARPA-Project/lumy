import React, { useState, createContext } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

// import teal from '@material-ui/core/colors/teal'
import amber from '@material-ui/core/colors/amber'

import { createMuiTheme, MuiThemeProvider, Theme } from '@material-ui/core/styles'
import { PaletteType, ThemeOptions } from '@material-ui/core'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    layout: {
      sideBarFullWidth: React.CSSProperties['width']
      sideBarCollapsedWidth: React.CSSProperties['width']
      navLinkTextWidth: React.CSSProperties['width']
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    layout?: {
      sideBarFullWidth?: React.CSSProperties['width']
      sideBarCollapsedWidth?: React.CSSProperties['width']
      navLinkTextWidth: React.CSSProperties['width']
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

  const createCustomTheme = (additionalOptions?: ThemeOptions) =>
    createMuiTheme({
      palette: {
        type: darkModeEnabled ? ('dark' as PaletteType) : ('light' as PaletteType),
        // primary: {
        //   main: teal[500]
        // },
        secondary: {
          main: amber[500]
        }
      },
      typography: {
        body1: {
          fontSize: '0.875rem',
          lineHeight: 1.43
        },
        body2: {
          fontSize: '0.75rem',
          lineHeight: 1.35
        }
      },
      props: {
        MuiSvgIcon: {
          fontSize: 'small'
        }
      },
      layout: {
        sideBarFullWidth: '200px',
        sideBarCollapsedWidth: '52px',
        navLinkTextWidth: 90
      },
      ...additionalOptions
    })

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
