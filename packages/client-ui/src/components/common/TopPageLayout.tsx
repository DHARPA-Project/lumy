import React, { useContext } from 'react'

import { ThemeProvider } from '@material-ui/core/styles'

import useStyles from './TopPageLayout.styles'
import { ThemeContext } from '../../context/themeContext'
import { PageLayoutContext } from '../../context/pageLayoutContext'

import LeftSideBarContainer from './navigation/LeftSideBarContainer'
import LeftSideBarContent from './navigation/LeftSideBarContent'
import RightSideBarContainer from './toolbar/RightSideBarContainer'

type TopPageLayoutProps = {
  children: React.ReactNode
}

const TopPageLayout = ({ children }: TopPageLayoutProps): JSX.Element => {
  const classes = useStyles()

  const { sidebarTheme } = useContext(ThemeContext)
  const { isLeftSideBarExpanded, isRightSideBarVisible } = useContext(PageLayoutContext)

  return (
    <div className={classes.root}>
      <ThemeProvider theme={sidebarTheme}>
        <LeftSideBarContainer>
          <LeftSideBarContent />
        </LeftSideBarContainer>
        <RightSideBarContainer></RightSideBarContainer>
      </ThemeProvider>

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
