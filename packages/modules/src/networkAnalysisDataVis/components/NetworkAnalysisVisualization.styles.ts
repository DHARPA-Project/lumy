import { makeStyles, Theme } from '@material-ui/core/styles'

/**
 * TODO: this is already declared in `client-ui`. Consider
 * moving theme handling to a separate package that can be referenced
 * here.
 */
interface CustomTheme extends Theme {
  layout: {
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
}

export default makeStyles((theme: CustomTheme) => ({
  visualizationContainer: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'minmax(250px, 25%) auto'
  },
  graphContainer: {
    height: `calc(100% - 2 * ${theme.layout.scrollBarWidth}px)`,
    position: 'relative'
  }
}))
