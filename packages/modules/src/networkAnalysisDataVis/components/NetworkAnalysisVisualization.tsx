import React, { useContext } from 'react'

import { useElement } from '@dharpa-vre/datavis-components'
import { NetworkGraphContext } from '../context'
import { normalizedValue } from '../utils'
import useStyles from './NetworkAnalysisVisualization.styles'

import { NodeTooltip } from './NodeTooltip'
import { GraphStatsPanel } from './statistics/GraphStatsPanel'
import VisualizationSettings from './settings/VisualizationSettings'

useElement('network-force')

const NetworkAnalysisVisualizationContainer = (): JSX.Element => {
  const classes = useStyles()

  const {
    colorCodeNodes,
    graphBox,
    graphContainerRef,
    graphRef,
    graphStats,
    graphTooltipInfo,
    isDisplayIsolated,
    isDisplayLabels,
    labelNodeSizeThreshold,
    nodeScalerParams,
    nodeScalingMethod
  } = useContext(NetworkGraphContext) // prettier-ignore

  return (
    <div className={classes.visualizationContainer}>
      <div className="left">
        <GraphStatsPanel graphStats={graphStats} />

        <VisualizationSettings />
      </div>

      <div ref={graphContainerRef} className={classes.graphContainer}>
        {graphTooltipInfo != null && (
          <NodeTooltip
            position={{
              left: graphTooltipInfo.mouseCoordinates.x,
              top: graphTooltipInfo.mouseCoordinates.y
            }}
            label={graphTooltipInfo.nodeMetadata.label}
            scalingMethod={nodeScalingMethod}
            scalingValue={graphTooltipInfo.nodeMetadata.scaler}
            group={graphTooltipInfo.nodeMetadata.group}
          />
        )}
        <network-force
          displayIsolatedNodes={isDisplayIsolated ? undefined : true}
          displayLabels={isDisplayLabels ? undefined : false}
          colorCodeNodes={colorCodeNodes ? undefined : false}
          labelNodeSizeThreshold={normalizedValue(
            labelNodeSizeThreshold,
            nodeScalerParams.min,
            nodeScalerParams.max
          )}
          reapplySimulationOnUpdate={undefined}
          width={graphBox?.width ?? 0}
          height={((graphBox?.width ?? 0) * 2) / 3}
          ref={graphRef}
        />
      </div>
    </div>
  )
}

export default NetworkAnalysisVisualizationContainer
