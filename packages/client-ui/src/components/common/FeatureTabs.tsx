import React, { useContext } from 'react'

import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { featureList } from '../../const/features'
import { WorkflowContext } from '../../context/workflowContext'

import TabPanel from './TabPanel'

const useStyles = makeStyles(theme => ({
  featureContainer: {
    minHeight: '100vh',
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

  const { featureTabIndex, setFeatureTabIndex } = useContext(WorkflowContext)

  return (
    <div className={classes.featureContainer}>
      <AppBar position="static" color="default" elevation={0}>
        <Tabs
          className={classes.tabList}
          value={featureTabIndex}
          onChange={(event, newTabIndex) => setFeatureTabIndex(newTabIndex)}
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
    </div>
  )
}

export default FeatureTabs
