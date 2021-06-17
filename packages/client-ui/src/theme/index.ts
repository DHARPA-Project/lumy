import { createMuiTheme, Theme } from '@material-ui/core/styles'
import { PaletteType, ThemeOptions } from '@material-ui/core'

import defaultTheme from './muiDefaultTheme'
import muiDefaultProps from './muiDefaultProps'
import muiThemeOverrides from './muiThemeOverrides'

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

/**
 * Shallow-merge additional options on top of default options to create custom MUI themes
 * @param extendedOptions object containing default Material UI theme options
 * @returns extended Material UI theme object
 */
export const createCustomTheme = (extendedOptions?: ThemeOptions, darkModeEnabled?: boolean): Theme =>
  createMuiTheme({
    palette: {
      type: darkModeEnabled ? ('dark' as PaletteType) : ('light' as PaletteType),
      secondary: defaultTheme.palette.primary
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
      },
      h5: {
        fontSize: '1.1rem',
        lineHeight: 1.6
      },
      h6: {
        fontSize: '1rem',
        lineHeight: 1.5
      }
    },
    props: muiDefaultProps,
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
    overrides: muiThemeOverrides,
    ...extendedOptions
  })
