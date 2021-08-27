import React, { useContext } from 'react'

import useStyles from './LeftSideBarContainer.styles'
import { LayoutContext } from '../../../state'

type LeftSideBarContainerProps = {
  children: React.ReactNode
}

const LeftSideBarContainer = ({ children }: LeftSideBarContainerProps): JSX.Element => {
  const classes = useStyles()

  const { isLeftSideBarExpanded } = useContext(LayoutContext)

  return (
    <div className={`${classes.sideBarContainer}${isLeftSideBarExpanded ? '' : ' collapsed'}`}>
      {children}
    </div>
  )
}

export default LeftSideBarContainer
