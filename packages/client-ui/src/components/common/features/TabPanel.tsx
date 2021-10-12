import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Theme } from '@lumy/styles'

import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'

type TabPanelProps = {
  children: React.ReactNode
  value: number
  index: number
  id?: string
}

const useStyles = makeStyles((theme: Theme) => ({
  tabPanel: {
    height: `calc(100% - ${theme.layout.tabHeight}px)`,
    marginTop: theme.layout.tabHeight,
    paddingTop: theme.spacing(1.5),
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    overflow: 'overlay'
  }
}))

const TabPanel = ({ children, value, index, id, ...other }: TabPanelProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={id ? id : `scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={1000}>
          <Box>{children}</Box>
        </Fade>
      )}
    </div>
  )
}

export default TabPanel
