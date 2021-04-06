import React, { useState } from 'react'

import useStyles from './TopPageLayout.styles'

import SideBar from './navigation/SideBar'

type TopPageLayoutProps = {
  children: React.ReactNode
}

const TopPageLayout = ({ children }: TopPageLayoutProps): JSX.Element => {
  const classes = useStyles()

  const [isSideBarCollapsed, setIsSideBarCollapsed] = useState(true)

  return (
    <div className={`${classes.root}${isSideBarCollapsed ? ' collapsed' : ''}`}>
      <SideBar isSideBarCollapsed={isSideBarCollapsed} setIsSideBarCollapsed={setIsSideBarCollapsed} />

      <div className={classes.pageContent}>{children}</div>
    </div>
  )
}

export default TopPageLayout
