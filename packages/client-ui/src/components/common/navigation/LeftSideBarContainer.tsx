import React, { useContext } from 'react'

import Paper from '@material-ui/core/Paper'

import useStyles from './LeftSideBarContainer.styles'
import { PageLayoutContext } from '../../../context/pageLayoutContext'

type LeftSideBarContainerProps = {
  children: React.ReactNode
}

const LeftSideBarContainer = ({ children }: LeftSideBarContainerProps): JSX.Element => {
  const classes = useStyles()

  const { isLeftSideBarExpanded } = useContext(PageLayoutContext)

  return (
    <Paper square={true} className={`${classes.root}${isLeftSideBarExpanded ? '' : ' collapsed'}`}>
      {children}
    </Paper>
  )
}

export default LeftSideBarContainer
