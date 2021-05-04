import React, { useContext } from 'react'

import Fade from '@material-ui/core/Fade'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import useStyles from './RightSideBarContent.styles'
import { PageLayoutContext } from '../../../context/pageLayoutContext'
import { featureList } from '../../../const/features'

const RightSideBarContent = (): JSX.Element => {
  const classes = useStyles()

  const { isRightSideBarVisible, setSideDrawerTabIndex, setIsSideDrawerOpen } = useContext(PageLayoutContext)

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
                setSideDrawerTabIndex(index)
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
