import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import ExploreIcon from '@material-ui/icons/Explore'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'

import { pageRoutes, projectRoutes } from '../../../const/routes'
import useStyles from './SideBar.styles'

import NavItem from './NavItem'

type SideBarProps = {
  isSideBarCollapsed: boolean
  setIsSideBarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SideBar = ({ isSideBarCollapsed, setIsSideBarCollapsed }: SideBarProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={`${classes.root}${isSideBarCollapsed ? ' collapsed' : ''}`}>
      <div className={classes.sideBarTop}>
        <div
          onClick={() => setIsSideBarCollapsed(prevStatus => !prevStatus)}
          className={classes.sideBarToggleButton}
        >
          <DoubleArrowIcon className={classes.sideBarExpandArrow + (isSideBarCollapsed ? '' : ' inward')} />
        </div>

        <Grow
          in={!isSideBarCollapsed}
          style={{ transformOrigin: '0 0 0' }}
          {...(isSideBarCollapsed ? { timeout: 0 } : { timeout: 1000 })}
        >
          <Typography variant="h6" component="h2" color="primary" className={classes.logo}>
            <ExploreIcon /> &nbsp;DHARPA
          </Typography>
        </Grow>
      </div>

      <nav>
        <List>
          {pageRoutes.map((route, index) => (
            <NavItem key={index} isNavBarExpanded={!isSideBarCollapsed} nested={false} {...route} />
          ))}
          {projectRoutes.map((route, index) => (
            <NavItem key={index} isNavBarExpanded={!isSideBarCollapsed} nested={false} {...route} />
          ))}
        </List>
      </nav>

      <div className={classes.sideBarBottom}>
        <IconButton onClick={() => alert('shutting the app down...')}>
          <PowerSettingsNewIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default SideBar
