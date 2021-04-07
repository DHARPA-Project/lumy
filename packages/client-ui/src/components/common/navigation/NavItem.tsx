import React from 'react'

import Divider from '@material-ui/core/Divider'

import useStyles from './NavItem.styles'
import { NavItemType } from '../../../const/routes'
import { NavBarLinkProps } from './NavBarLink'

import NavHeading from './NavHeading'
import NavBarLink from './NavBarLink'
import NavGroup from './NavGroup'
import NavProjectLink from './NavProjectLink'

type NavItemProps = {
  type: NavItemType
  isNavBarExpanded: boolean
  label?: string
  link?: string
  icon?: JSX.Element
  nested?: boolean
  sublist?: NavBarLinkProps[]
}

const NavItem = ({
  link,
  icon,
  label,
  sublist,
  isNavBarExpanded,
  nested,
  type,
  ...otherProps
}: NavItemProps): JSX.Element => {
  const classes = useStyles()

  switch (type) {
    case NavItemType.heading:
      return <NavHeading label={label} isNavBarExpanded={isNavBarExpanded} />
    case NavItemType.divider:
      return <Divider className={classes.divider} />
    case NavItemType.group:
      return (
        <NavGroup
          icon={icon}
          navGroupMembers={sublist}
          label={label}
          link={link}
          isNavBarExpanded={isNavBarExpanded}
        />
      )
    case NavItemType.pageLink:
      return (
        <NavBarLink
          icon={icon}
          label={label}
          link={link}
          nested={nested}
          isNavBarExpanded={isNavBarExpanded}
        />
      )
    case NavItemType.projectLink:
      return <NavProjectLink isSideBarExpanded={isNavBarExpanded} label={label} link={link} {...otherProps} />
    default:
      return <h1>unknown navigation item</h1>
  }
}

export default NavItem
