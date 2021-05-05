import React, { useContext } from 'react'

import { ThemeProvider } from '@material-ui/core/styles'

import useStyles from './TopPageLayout.styles'
import { ThemeContext } from '../../context/themeContext'
import { PageLayoutContext } from '../../context/pageLayoutContext'

import LeftSideBarContainer from './navigation/LeftSideBarContainer'
import LeftSideBarContent from './navigation/LeftSideBarContent'
import RightSideBarContainer from './toolbar/RightSideBarContainer'
import RightSideBarContent from './toolbar/RightSideBarContent'
import SideDrawer from './SideDrawer'
import FeatureTabs from './FeatureTabs'

type TopPageLayoutProps = {
  children: React.ReactNode
}

const TopPageLayout = ({ children }: TopPageLayoutProps): JSX.Element => {
  const classes = useStyles()

  const { sidebarTheme } = useContext(ThemeContext)
  const { isLeftSideBarExpanded, isRightSideBarVisible } = useContext(PageLayoutContext)

  // TO DO: add condition to determine when tool bar should be rendered
  // (e.g. only on workflow project routes or certain workflow steps)
  const toolBarRenderCondition = true

  return (
    <div className={classes.root}>
      <ThemeProvider theme={sidebarTheme}>
        <LeftSideBarContainer>
          <LeftSideBarContent />
        </LeftSideBarContainer>
        {toolBarRenderCondition && (
          <RightSideBarContainer>
            <RightSideBarContent />
          </RightSideBarContainer>
        )}
      </ThemeProvider>
      <SideDrawer anchor="right">
        <FeatureTabs />
      </SideDrawer>

      <div
        className={
          classes.pageContent +
          (isLeftSideBarExpanded ? ' left-pinch' : '') +
          (isRightSideBarVisible ? ' right-pinch' : '')
        }
      >
        {children}
      </div>
    </div>
  )
}

export default TopPageLayout
