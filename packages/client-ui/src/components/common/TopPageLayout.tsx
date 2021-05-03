import React, { useContext } from 'react'

import { ThemeProvider } from '@material-ui/core/styles'

import useStyles from './TopPageLayout.styles'
import { ThemeContext } from '../../context/themeContext'
import { PageLayoutContext } from '../../context/pageLayoutContext'

import LeftSideBarContainer from './navigation/LeftSideBarContainer'
import LeftSideBarContent from './navigation/LeftSideBarContent'

type TopPageLayoutProps = {
  children: React.ReactNode
}

const TopPageLayout = ({ children }: TopPageLayoutProps): JSX.Element => {
  const classes = useStyles()

  const { sidebarTheme } = useContext(ThemeContext)
  const { isLeftSideBarExpanded } = useContext(PageLayoutContext)

  return (
    <div className={`${classes.root}${isLeftSideBarExpanded ? '' : ' collapsed'}`}>
      <ThemeProvider theme={sidebarTheme}>
        <LeftSideBarContainer>
          <LeftSideBarContent />
        </LeftSideBarContainer>
      </ThemeProvider>

      <div className={classes.pageContent}>{children}</div>
    </div>
  )
}

export default TopPageLayout
