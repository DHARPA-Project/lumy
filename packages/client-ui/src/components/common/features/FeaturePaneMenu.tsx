import React, { useContext, useState } from 'react'

import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'

import useStyles from './FeaturePaneMenu.styles'
import { WorkflowContext } from '../../..'
import { screenSplitDirectionType } from '../../../state'
import { useAppFeatures } from '../../../const/features'

const FeaturePaneMenu = (): JSX.Element => {
  const classes = useStyles()

  const featureList = useAppFeatures()

  const {
    isAdditionalPaneVisible,
    setSplitDirection,
    screenSplitOptions,
    closeAdditionalPane,
    openFeatureTab
  } = useContext(WorkflowContext)

  const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false)

  return (
    <SpeedDial
      classes={{
        root: classes.speedDialRoot,
        fab: classes.speedDialFab,
        actions: classes.speedDialActions,
        directionUp: classes.speedDialDirectionUp,
        directionDown: classes.speedDialDirectionDown,
        directionLeft: classes.speedDialDirectionLeft,
        directionRight: classes.speedDialDirectionRight
      }}
      onClose={(_, reason: string) => {
        if (isAdditionalPaneVisible && reason === 'toggle') closeAdditionalPane()
        setIsSpeedDialOpen(false)
      }}
      onOpen={() => setIsSpeedDialOpen(true)}
      open={isSpeedDialOpen}
      icon={<SpeedDialIcon />}
      direction="up"
      FabProps={{ size: 'small' }}
      ariaLabel={isAdditionalPaneVisible ? 'screen-split-options' : 'tools'}
    >
      {isAdditionalPaneVisible
        ? screenSplitOptions.map((option, index) => (
            <SpeedDialAction
              key={index}
              icon={option.icon}
              tooltipTitle={option.tooltipText}
              onClick={() => setSplitDirection(option.direction as screenSplitDirectionType)}
              classes={{ fab: classes.speedDialActionFab }}
            />
          ))
        : featureList.map((feature, index) => (
            <SpeedDialAction
              key={feature.id}
              icon={feature.icon}
              tooltipTitle={feature.tooltip}
              onClick={() => openFeatureTab(index)}
              classes={{ fab: classes.speedDialActionFab }}
            />
          ))}
    </SpeedDial>
  )
}

export default FeaturePaneMenu
