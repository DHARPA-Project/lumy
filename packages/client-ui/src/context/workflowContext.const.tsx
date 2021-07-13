import React from 'react'

import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit'

import { screenSplitOption } from './workflowContext.types'

export const screenSplitOptions: screenSplitOption[] = [
  {
    name: 'horizontal',
    icon: <HorizontalSplitIcon />,
    tooltipText: 'split: top / bottom',
    direction: 'vertical'
  },
  {
    name: 'vertical',
    icon: <VerticalSplitIcon />,
    tooltipText: 'split: left / right',
    direction: 'horizontal'
  }
]

export const workflowLayoutLocalStorageKey = 'lumy-workflow-layout'
