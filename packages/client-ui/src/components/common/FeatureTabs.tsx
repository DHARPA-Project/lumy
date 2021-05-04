import React, { useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { featureList } from '../../const/features'
import { PageLayoutContext } from '../../context/pageLayoutContext'

import TabPanel from './TabPanel'

const useStyles = makeStyles(theme => ({
  tabList: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  tabItem: {
    minWidth: 100,
    flex: 1
  }
}))

const FeatureTabs = (): JSX.Element => {
  const classes = useStyles()

  const { sideDrawerTabIndex, setSideDrawerTabIndex } = useContext(PageLayoutContext)

  return (
    <div className={classes.tabList}>
      <AppBar position="static" color="default">
        <Tabs
          value={sideDrawerTabIndex}
          onChange={(event, newTabIndex) => setSideDrawerTabIndex(newTabIndex)}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
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
        <TabPanel value={sideDrawerTabIndex} index={index} key={id}>
          {content}
        </TabPanel>
      ))}
    </div>
  )
}

export default FeatureTabs
