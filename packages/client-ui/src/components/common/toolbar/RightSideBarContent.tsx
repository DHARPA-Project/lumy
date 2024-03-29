import React, { useContext } from 'react'

import Fade from '@material-ui/core/Fade'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import useStyles from './RightSideBarContent.styles'
import { WorkflowContext } from '../../../state'
import { useAppFeatures } from '../../../const/features'

const RightSideBarContent = (): JSX.Element => {
  const classes = useStyles()
  const featureList = useAppFeatures()

  const { isRightSideBarVisible, setFeatureTabIndex, setIsSideDrawerOpen } = useContext(WorkflowContext)

  return (
    <>
      {featureList.map(({ id, tooltip, icon }, index) => (
        <Fade
          in={isRightSideBarVisible}
          {...(!isRightSideBarVisible ? { timeout: 0 } : { timeout: 1000 })}
          key={id}
        >
          <Tooltip title={tooltip} placement="left">
            <IconButton
              className={classes.toolBarIcon}
              onClick={() => {
                setFeatureTabIndex(index)
                setIsSideDrawerOpen(true)
              }}
              size="small"
              aria-label={`toggle-${id}`}
            >
              {icon}
            </IconButton>
          </Tooltip>
        </Fade>
      ))}
    </>
  )
}

export default RightSideBarContent
