import React, { useState, createContext } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import teal from '@material-ui/core/colors/teal'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

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
}

type ThemeContextProviderProps = {
  children?: React.ReactNode
}

export const ThemeContext = createContext<ThemeContextType>(null)

const getThemeFromLocalStorage = () => {
  const valueInLocalStorage = localStorage.getItem('darkModeEnabled')
  return valueInLocalStorage ? JSON.parse(valueInLocalStorage) : true
}

const ThemeContextProvider = ({ children }: ThemeContextProviderProps): JSX.Element => {
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(getThemeFromLocalStorage)

  const toggleDarkMode = () => {
    setDarkModeEnabled(previousMode => {
      localStorage.setItem('darkModeEnabled', JSON.stringify(!previousMode))
      return !previousMode
    })
  }

  const theme = createMuiTheme({
    palette: {
      type: darkModeEnabled ? 'dark' : 'light',
      primary: {
        main: teal[500]
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
    }
  })

  return (
    <ThemeContext.Provider value={{ darkModeEnabled, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider
