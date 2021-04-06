import React from 'react'
import { NavLink } from 'react-router-dom'

import Grow from '@material-ui/core/Grow'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import useStyles from './NavBarLink.styles'

export type NavBarLinkProps = {
  isNavBarExpanded?: boolean
  label?: string
  link?: string
  icon?: JSX.Element
  nested?: boolean
  pathname?: string
}

const NavBarLink = ({ icon, isNavBarExpanded, label, link, nested }: NavBarLinkProps): JSX.Element => {
  const classes = useStyles()

  return (
    <ListItem button component={link && NavLink} to={link} className={classes.link} disableRipple>
      {!nested && <ListItemIcon className={classes.linkIcon}>{icon}</ListItemIcon>}

      <Grow
        in={isNavBarExpanded}
        style={{ transformOrigin: '0 0 0' }}
        {...(isNavBarExpanded ? { timeout: 1000 } : { timeout: 0 })}
      >
        <ListItemText
          className={classes.navLinkText + (isNavBarExpanded ? '' : ' invisible')}
          primary={label}
          primaryTypographyProps={{ noWrap: true }}
        />
      </Grow>
    </ListItem>
  )
}

export default NavBarLink
