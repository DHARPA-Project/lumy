import React, { useContext, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

import { makeStyles, useTheme } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { featureList } from '../../const/features'
import { WorkflowContext } from '../../context/workflowContext'

import TabPanel from './TabPanel'

const useStyles = makeStyles(theme => ({
  featureContainer: {
    height: '100%',
    width: '100%',
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  tabList: {
    '& .MuiTab-labelIcon': {
      minHeight: theme.spacing(6)
    },
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      '& .MuiSvgIcon-root': {
        marginBottom: 0,
        marginRight: theme.spacing(1)
      }
    }
  },
  tabItem: {
    minWidth: 100,
    flex: 1
  }
}))

const FeatureTabs = (): JSX.Element => {
  const classes = useStyles()
  const theme = useTheme()

  const containerRef = useRef(null)
  const tabActionRef = useRef(null)

  const { featureTabIndex, setFeatureTabIndex } = useContext(WorkflowContext)

  // update MUI tab indicator to correct its misplacement after tab width change
  useEffect(() => {
    const indicatorUpdateTimeout = setTimeout(() => {
      tabActionRef.current.updateIndicator()
    }, theme.transitions.duration.standard)

    return () => {
      clearTimeout(indicatorUpdateTimeout)
    }
  }, [containerRef.current?.getBoundingClientRect()?.width, theme])

  return (
    <motion.div
      className={classes.featureContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      ref={containerRef}
    >
      <AppBar position="fixed" color="default" elevation={0}>
        <Tabs
          className={classes.tabList}
          value={featureTabIndex}
          onChange={(event, newTabIndex) => setFeatureTabIndex(newTabIndex)}
          action={tabActionRef}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
          scrollButtons="off"
          aria-label="scrollable auto icon tabs"
        >
          {featureList.map(({ id, label, icon }) => (
            <Tab
              className={classes.tabItem}
              label={label}
              icon={icon}
              id={`simple-tab-${id}`}
              aria-controls={`simple-tabpanel-${id}`}
              key={id}
            />
          ))}
        </Tabs>
      </AppBar>

      {featureList.map(({ id, content }, index) => (
        <TabPanel value={featureTabIndex} index={index} key={id}>
          {content}
        </TabPanel>
      ))}
    </motion.div>
  )
}

export default FeatureTabs
