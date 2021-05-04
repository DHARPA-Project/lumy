import React from 'react'

import Box from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'

type TabPanelProps = {
  children: React.ReactNode
  value: number
  index: number
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps): JSX.Element => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={value === index} timeout={1000}>
          <Box p={3}>{children}</Box>
        </Fade>
      )}
    </div>
  )
}

export default TabPanel
