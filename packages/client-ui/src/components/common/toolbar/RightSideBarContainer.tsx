import React, { useContext } from 'react'

import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'

import useStyles from './RightSideBarContainer.styles'
import { PageLayoutContext } from '../../../context/pageLayoutContext'

type RightSideBarContainerProps = {
  children?: React.ReactNode
}

const RightSideBarContainer = ({ children }: RightSideBarContainerProps): JSX.Element => {
  const classes = useStyles()

  const { isRightSideBarVisible, setIsRightSideBarVisible } = useContext(PageLayoutContext)

  return (
    <Paper square={true} className={`${classes.root}${isRightSideBarVisible ? '' : ' collapsed'}`}>
      <Fab
        className={classes.sideBarToggleButton}
        onClick={() => setIsRightSideBarVisible(prevStatus => !prevStatus)}
        variant="extended"
        size="small"
        color="primary"
        aria-label="toggle"
      >
        <DoubleArrowIcon className={classes.sideBarExpandArrow + (isRightSideBarVisible ? ' inward' : '')} />
      </Fab>
      {children}
    </Paper>
  )
}

export default RightSideBarContainer
