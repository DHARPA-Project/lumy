import React, { useState } from 'react'

import SwipeableViews from 'react-swipeable-views'

import { useTheme } from '@material-ui/core/styles'

import useStyles from './NAGraphContainer.styles'

import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import BubbleChartIcon from '@material-ui/icons/BubbleChart'
import MultilineChartIcon from '@material-ui/icons/MultilineChart'
import TableChartIcon from '@material-ui/icons/TableChart'

import TabPanel from './TabPanel'
import NetworkGraph from './NetworkGraph'
import ArcDiagram from './ArcDiagram'
import NetworkMatrixGraph from './NetworkMatrixGraph'

const graphTabList = [
  {
    label: 'network graph',
    icon: <BubbleChartIcon />,
    content: <NetworkGraph />
  },
  {
    label: 'arc diagram',
    icon: <MultilineChartIcon />,
    content: <ArcDiagram />
  },
  {
    label: 'network matrix',
    icon: <TableChartIcon />,
    content: <NetworkMatrixGraph />
  }
]

const NAGraphContainer = (): JSX.Element => {
  const theme = useTheme()
  const classes = useStyles()

  const [tabIndex, setTabIndex] = useState<number>(0)

  return (
    <Paper className={classes.root}>
      <AppBar position="static" color="default" elevation={0}>
        <Tabs
          value={tabIndex}
          onChange={(event, newTabIndex) => setTabIndex(newTabIndex)}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto icon label tabs"
          selectionFollowsFocus={true}
        >
          {graphTabList.map((tab, index) => (
            <Tab
              className={classes.tabItem}
              label={tab.label}
              icon={tab.icon}
              id={`simple-tab-${index}`}
              aria-controls={`simple-tabpanel-${index}`}
              key={index}
            />
          ))}
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabIndex}
        onChangeIndex={(index: number) => setTabIndex(index)}
      >
        {graphTabList.map((tab, index) => (
          <TabPanel value={tabIndex} index={index} key={index}>
            {tab.content}
          </TabPanel>
        ))}
      </SwipeableViews>
    </Paper>
  )
}

export default NAGraphContainer
