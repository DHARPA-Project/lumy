import React, { useContext } from 'react'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import ExploreIcon from '@material-ui/icons/Explore'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'

import { ProjectContext } from '../../../context/projectContext'
import { pageRoutes, NavItemType } from '../../../const/routes'
import useStyles from './SideBar.styles'

import NavItem from './NavItem'

type SideBarProps = {
  isSideBarCollapsed: boolean
  setIsSideBarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SideBar = ({ isSideBarCollapsed, setIsSideBarCollapsed }: SideBarProps): JSX.Element => {
  const classes = useStyles()

  const { projectList } = useContext(ProjectContext)

  return (
    <Paper className={`${classes.root}${isSideBarCollapsed ? ' collapsed' : ''}`}>
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
          {projectList.map(project => (
            <NavItem
              key={project.id}
              isNavBarExpanded={!isSideBarCollapsed}
              nested={false}
              label={project.name}
              link={`/projects/${project.id}`}
              totalSteps={project.totalSteps}
              currentStep={project.currentStep}
              type={NavItemType.projectLink}
            />
          ))}
        </List>
      </nav>

      <div className={classes.sideBarBottom}>
        <IconButton onClick={() => alert('shutting the app down...')}>
          <PowerSettingsNewIcon />
        </IconButton>
      </div>
    </Paper>
  )
}

export default SideBar
