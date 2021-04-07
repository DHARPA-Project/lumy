import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

import Collapse from '@material-ui/core/Collapse'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import AcUnitIcon from '@material-ui/icons/AcUnit'
import ExpandMore from '@material-ui/icons/ExpandMore'

import useStyles from './NavGroup.styles'
import { NavBarLinkProps } from './NavBarLink'

import NavBarLink from './NavBarLink'

type NavGroupProps = {
  isNavBarExpanded: boolean
  navGroupMembers: Partial<NavBarLinkProps>[]
  label?: string
  link?: string
  icon?: JSX.Element
}

const NavGroup = ({ icon, isNavBarExpanded, navGroupMembers, label, link }: NavGroupProps): JSX.Element => {
  const classes = useStyles()

  const [isNavGroupExpanded, setIsNavGroupExpanded] = useState(false)

  const toggleCollapse = (event: React.MouseEvent) => {
    if (isNavBarExpanded) {
      event.preventDefault()
      setIsNavGroupExpanded(prevExpandedStatus => !prevExpandedStatus)
    }
  }

  return (
    <>
      <ListItem
        button
        component={link && NavLink}
        onClick={toggleCollapse}
        className={classes.topLink}
        to={link}
        disableRipple
      >
        <ListItemIcon className={classes.topLinkIcon}>{icon ? icon : <AcUnitIcon />}</ListItemIcon>

        <Grow
          in={isNavBarExpanded}
          style={{ transformOrigin: '0 0 0' }}
          {...(isNavBarExpanded ? { timeout: 500 } : {})}
        >
          <ListItemText
            className={classes.navLinkText + (isNavBarExpanded ? '' : ' invisible')}
            primary={label}
            primaryTypographyProps={{ noWrap: true }}
          />
        </Grow>

        <Grow
          in={isNavBarExpanded}
          style={{ transformOrigin: '0 0 0' }}
          {...(isNavBarExpanded ? { timeout: 500 } : {})}
        >
          <div>
            <ExpandMore className={classes.expandIcon + (isNavGroupExpanded ? ' reversed' : '')} />
          </div>
        </Grow>
      </ListItem>

      {navGroupMembers && (
        <Collapse
          in={isNavGroupExpanded && isNavBarExpanded}
          timeout="auto"
          unmountOnExit
          className={classes.nestedList}
        >
          <List component="div" disablePadding>
            {navGroupMembers.map((navLink, index) => (
              <NavBarLink
                key={index}
                icon={navLink.icon}
                isNavBarExpanded={isNavBarExpanded}
                label={navLink.label}
                link={navLink.link}
                nested={navLink.nested}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}

export default NavGroup
