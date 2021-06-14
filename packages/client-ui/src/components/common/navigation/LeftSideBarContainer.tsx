import React, { useContext } from 'react'

import useStyles from './LeftSideBarContainer.styles'
import { PageLayoutContext } from '../../../context/pageLayoutContext'

type LeftSideBarContainerProps = {
  children: React.ReactNode
}

const LeftSideBarContainer = ({ children }: LeftSideBarContainerProps): JSX.Element => {
  const classes = useStyles()

  const { isLeftSideBarExpanded } = useContext(PageLayoutContext)

  return (
    <div className={`${classes.sideBarContainer}${isLeftSideBarExpanded ? '' : ' collapsed'}`}>
      {children}
    </div>
  )
}

export default LeftSideBarContainer
