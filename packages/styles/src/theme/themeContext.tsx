import React, { useState, createContext } from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'

import { MuiThemeProvider, Theme } from '@material-ui/core/styles'

import { createCustomTheme } from '../theme'
import { languageToMuiLocale } from './locale'

export type ThemeContextType = {
  darkModeEnabled: boolean
  toggleDarkMode: () => void
  sidebarTheme: Theme
}

type ThemeContextProviderProps = {
  locale: Navigator['language']
  children?: React.ReactNode
}

export const ThemeContext = createContext<ThemeContextType>(null)

const getThemeFromLocalStorage = () => {
  const valueInLocalStorage = localStorage.getItem('darkModeEnabled')
  return valueInLocalStorage ? JSON.parse(valueInLocalStorage) : false
}

const ThemeContextProvider = ({ locale, children }: ThemeContextProviderProps): JSX.Element => {
  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(getThemeFromLocalStorage)

  const toggleDarkMode = () => {
    setDarkModeEnabled(previousMode => {
      localStorage.setItem('darkModeEnabled', JSON.stringify(!previousMode))
      return !previousMode
    })
  }

  // Keep in mind that createCustomTheme() performs a shallow merge...
  // ... of default option and extended option objects; deeply nested properties...
  // ... of default theme may be lost if not copied over to extended option object
  const globalTheme = createCustomTheme(undefined, undefined, languageToMuiLocale(locale))
  const sidebarTheme = createCustomTheme(
    {
      palette: {
        type: 'light'
        // background: {
        //   paper: '#222A45',
        //   default: '#1a2038'
        // }
      }
    },
    undefined,
    languageToMuiLocale(locale)
  )

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
