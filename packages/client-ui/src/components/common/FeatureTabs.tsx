import React, { useContext, useRef } from 'react'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import { featureList } from '../../const/features'
import { WorkflowContext } from '../../state'
import useStyles from './FeatureTabs.styles'

import TabPanel from './TabPanel'

const FeatureTabs = (): JSX.Element => {
  const classes = useStyles()

  const containerRef = useRef(null)
  const tabActionRef = useRef(null)

  const { featureTabIndex, setFeatureTabIndex } = useContext(WorkflowContext)

  return (
    <div className={classes.featureContainer} ref={containerRef}>
      <AppBar position="absolute" color="default" variant="elevation" elevation={0}>
        <Tabs
          value={featureTabIndex}
          onChange={(event, newTabIndex) => setFeatureTabIndex(newTabIndex)}
          action={tabActionRef}
          variant="scrollable"
          scrollButtons="off"
          aria-label="scrollable auto icon tabs"
        >
          {featureList.map(({ id, label, icon }) => (
            <Tab
              classes={{ wrapper: classes.tabWrapper, root: classes.tabItem }}
              label={label}
              icon={icon}
              id={`feature-pane-tab-${id}`}
              aria-controls={`feature-pane-tab-${id}`}
              key={id}
            />
          ))}
        </Tabs>
      </AppBar>

      {featureList.map(({ id, content }, index) => (
        <TabPanel value={featureTabIndex} index={index} id={id} key={id}>
          {content}
        </TabPanel>
      ))}
    </div>
  )
}

export default FeatureTabs
