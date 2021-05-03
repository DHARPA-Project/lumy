import React, { useContext } from 'react'

import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Grow from '@material-ui/core/Grow'

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import ExploreIcon from '@material-ui/icons/Explore'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'

import { ProjectContext } from '../../../context/projectContext'
import { PageLayoutContext } from '../../../context/pageLayoutContext'
import { pageRoutes, NavItemType } from '../../../const/routes'
import useStyles from './LeftSideBarContent.styles'

import NavItem from './NavItem'

const LeftSideBarContent = (): JSX.Element => {
  const classes = useStyles()

  const { isLeftSideBarExpanded, setIsLeftSideBarExpanded } = useContext(PageLayoutContext)

  const { projectList } = useContext(ProjectContext)

  return (
    <>
      <div className={classes.sideBarTop}>
        <div
          onClick={() => setIsLeftSideBarExpanded(prevStatus => !prevStatus)}
          className={classes.sideBarToggleButton}
        >
          <DoubleArrowIcon
            className={classes.sideBarExpandArrow + (isLeftSideBarExpanded ? ' inward' : '')}
          />
        </div>

        <Grow
          in={isLeftSideBarExpanded}
          style={{ transformOrigin: '0 0 0' }}
          {...(!isLeftSideBarExpanded ? { timeout: 0 } : { timeout: 1000 })}
        >
          <Typography variant="h6" component="h2" color="primary" className={classes.logo}>
            <ExploreIcon /> &nbsp;DHARPA
          </Typography>
        </Grow>
      </div>

      <nav>
        <List>
          {pageRoutes.map((route, index) => (
            <NavItem key={index} isNavBarExpanded={isLeftSideBarExpanded} nested={false} {...route} />
          ))}
          {projectList.map(project => (
            <NavItem
              key={project.id}
              isNavBarExpanded={isLeftSideBarExpanded}
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
    </>
  )
}

export default LeftSideBarContent
