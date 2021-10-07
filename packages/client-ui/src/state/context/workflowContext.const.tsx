import React from 'react'

import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit'

import { screenSplitOption } from './workflowContext.types'

export const screenSplitOptions: screenSplitOption[] = [
  {
    name: 'row',
    icon: <HorizontalSplitIcon />,
    tooltipText: 'split: top / bottom',
    direction: 'column'
  },
  {
    name: 'column',
    icon: <VerticalSplitIcon />,
    tooltipText: 'split: left / right',
    direction: 'row'
  }
]

export const workflowLayoutLocalStorageKey = 'lumy-workflow-layout'
