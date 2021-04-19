import React from 'react'

import Box from '@material-ui/core/Box'

type TabPanelProps = {
  index: number
  value: number
  children: React.ReactNode
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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

export default TabPanel
