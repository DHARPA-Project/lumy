import React, { useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Drawer from '@material-ui/core/Drawer'

import { WorkflowContext } from '../../context/workflowContext'

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: '50%',
    maxWidth: '80%',
    [theme.breakpoints.down('sm')]: {
      minWidth: 320
    }
  }
}))

type SideDrawerProps = {
  anchor: 'bottom' | 'left' | 'right' | 'top'
  children: React.ReactNode
}

const SideDrawer = ({ anchor, children }: SideDrawerProps): JSX.Element => {
  const classes = useStyles()

  const { isSideDrawerOpen, setIsSideDrawerOpen } = useContext(WorkflowContext)

  return (
    <Drawer
      variant="temporary"
      anchor={anchor}
      open={isSideDrawerOpen}
      onClose={() => setIsSideDrawerOpen(false)}
      classes={{ paper: classes.drawerPaper }}
    >
      {children}
    </Drawer>
  )
}

export default SideDrawer
