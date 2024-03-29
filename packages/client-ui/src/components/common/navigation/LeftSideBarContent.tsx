import React, { useContext } from 'react'

import List from '@material-ui/core/List'
// import Typography from '@material-ui/core/Typography'
// import Grow from '@material-ui/core/Grow'
// import Fab from '@material-ui/core/Fab'

// import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
// import ExploreIcon from '@material-ui/icons/Explore'

// import { ProjectContext } from '../../../context/projectContext'
import { LayoutContext } from '../../../state'
// import { pageRoutes, NavItemType } from '../../../const/routes'
import { usePageRoutes } from '../../../const/routes'
import useStyles from './LeftSideBarContent.styles'

import NavItem from './NavItem'
import NotificationButton from '../notifications/NotificationButton'
// import { FormattedMessage } from '@lumy/i18n'

const LeftSideBarContent = (): JSX.Element => {
  const classes = useStyles()
  const pageRoutes = usePageRoutes()

  // const { isLeftSideBarExpanded, setIsLeftSideBarExpanded } = useContext(LayoutContext)
  const { isLeftSideBarExpanded } = useContext(LayoutContext)

  // const { projectList } = useContext(ProjectContext)

  return (
    <>
      <div className={classes.sideBarTop}>
        <NotificationButton />

        {/* <Fab
          variant="extended"
          size="small"
          color="default"
          aria-label="toggle"
          className={classes.sideBarToggleButton + (isLeftSideBarExpanded ? ' aside' : '')}
          onClick={() => setIsLeftSideBarExpanded(prevStatus => !prevStatus)}
        >
          <DoubleArrowIcon
            className={classes.sideBarExpandArrow + (isLeftSideBarExpanded ? ' inward' : '')}
          />
        </Fab> */}

        {/* <Grow
          in={isLeftSideBarExpanded}
          style={{ transformOrigin: '0 0 0' }}
          {...(!isLeftSideBarExpanded ? { timeout: 0 } : { timeout: 1000 })}
        >
          <Typography variant="h6" component="h2" color="initial" className={classes.logo}>
            <ExploreIcon /> &nbsp;
            <FormattedMessage id="app.name" />
          </Typography>
        </Grow> */}
      </div>

      <nav className={classes.navList}>
        <List>
          {pageRoutes.map((route, index) => (
            <NavItem key={index} isNavBarExpanded={isLeftSideBarExpanded} nested={false} {...route} />
          ))}
          {/* {projectList.map(project => (
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
          ))} */}
        </List>
      </nav>

      <div className={classes.sideBarBottom}></div>
    </>
  )
}

export default LeftSideBarContent
