import React, { useContext } from 'react'

import { ThemeProvider } from '@material-ui/core/styles'
import { ThemeContext } from '@lumy/styles'

import useStyles from './TopPageLayout.styles'
import { LayoutContext } from '../../state'

import LeftSideBarContainer from './navigation/LeftSideBarContainer'
import LeftSideBarContent from './navigation/LeftSideBarContent'
import NotificationButton from './notifications/NotificationButton'

type TopPageLayoutProps = {
  children: React.ReactNode
}

const TopPageLayout = ({ children }: TopPageLayoutProps): JSX.Element => {
  const classes = useStyles()

  const { sidebarTheme } = useContext(ThemeContext)
  const { isLeftSideBarExpanded } = useContext(LayoutContext)

  return (
    <div className={classes.pageContainer}>
      <ThemeProvider theme={sidebarTheme}>
        <LeftSideBarContainer>
          <LeftSideBarContent />
        </LeftSideBarContainer>
      </ThemeProvider>

      <NotificationButton />

      <div className={classes.pageContent + (isLeftSideBarExpanded ? ' left-pinch' : '')}>{children}</div>
    </div>
  )
}

export default TopPageLayout
