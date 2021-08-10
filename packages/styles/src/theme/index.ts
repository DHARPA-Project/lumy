import { createMuiTheme, Theme } from '@material-ui/core/styles'
import { PaletteType, ThemeOptions } from '@material-ui/core'
import '@fontsource/roboto'

import muiDefaultProps from './muiDefaultProps'
import getMuiThemeOverrides from './muiThemeOverrides'

export type { LumyTheme, LumyThemeOptions } from './theme'

// the default/base Material UI theme object
const muiThemeBase = createMuiTheme()

/**
 * Generate new custom theme properties to extend the default MUI theme
 * @param theme base Material UI theme object
 * @returns object representing custom properties that do not exist on the default MUI theme
 */
const getCustomThemeProperties = (theme: Theme) => ({
  layout: {
    sideBarFullWidth: '200px',
    sideBarCollapsedWidth: '40px',
    navLinkTextWidth: 90,
    toolBarWidth: '50px',
    navBarTop: '20vh',
    navBarBottom: '10vh',
    pageHeaderHeight: theme.spacing(9),
    pagePadding: theme.spacing(2),
    toolContainerWidth: '50vw',
    scrollBarWidth: theme.spacing(0.5),
    tabHeight: theme.spacing(4),
    paneDividerWidth: '4px'
  }
})

/**
 * Shallow-merge additional options on top of default options to create custom MUI themes
 * @param additionalOptions object containing default Material UI theme options
 * @returns extended Material UI theme object
 */
export const createCustomTheme = (
  additionalOptions?: ThemeOptions,
  darkModeEnabled?: boolean,
  defaultMuiTheme: Theme = muiThemeBase
): Theme =>
  createMuiTheme({
    palette: {
      type: darkModeEnabled ? ('dark' as PaletteType) : ('light' as PaletteType),
      secondary: defaultMuiTheme.palette.primary
    },
    typography: {
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
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
    overrides: getMuiThemeOverrides({ ...defaultMuiTheme, ...getCustomThemeProperties(defaultMuiTheme) }),
    ...getCustomThemeProperties(defaultMuiTheme),
    ...additionalOptions
  })
