import { Theme } from '@material-ui/core/styles'
import { ThemeOptions } from '@material-ui/core'

interface LayoutThemeProps {
  sideBarFullWidth: React.CSSProperties['width']
  sideBarCollapsedWidth: React.CSSProperties['width']
  navLinkTextWidth: React.CSSProperties['width']
  toolBarWidth: React.CSSProperties['width']
  navBarTop: React.CSSProperties['height']
  navBarBottom: React.CSSProperties['height']
  pageHeaderHeight: React.CSSProperties['height']
  pagePadding: React.CSSProperties['padding']
  toolContainerWidth: React.CSSProperties['width']
  scrollBarWidth: React.CSSProperties['width']
  tabHeight: React.CSSProperties['width']
  paneDividerWidth: React.CSSProperties['width']
}

export interface LumyTheme extends Theme {
  layout?: LayoutThemeProps
}

export interface LumyThemeOptions extends ThemeOptions {
  layout?: LayoutThemeProps
}
