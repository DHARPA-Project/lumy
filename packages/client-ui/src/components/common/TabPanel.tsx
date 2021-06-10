import React from 'react'

import { makeStyles, Theme } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'

type TabPanelProps = {
  children: React.ReactNode
  value: number
  index: number
}

const useStyles = makeStyles((theme: Theme) => ({
  tabPanel: {
    marginTop: theme.spacing(6),
    height: `calc(100% - ${theme.spacing(5)}px)`,
    overflow: 'overlay'
  }
}))

const TabPanel = ({ children, value, index, ...other }: TabPanelProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
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
