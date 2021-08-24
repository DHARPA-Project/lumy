import React, { useContext, useRef } from 'react'

import { NetworkForce } from '@dharpa-vre/datavis-components'

import { NetworkGraphContext } from '../context'
import { normalizedValue } from '../utils'
import useStyles from './NetworkAnalysisVisualization.styles'
import { useBoxSize } from '../../hooks/useBoxSize'

import { NodeTooltip } from './NodeTooltip'
import { GraphStatsPanel } from './statistics/GraphStatsPanel'
import VisualizationSettings from './settings/VisualizationSettings'

console.debug(`Registering visualisation component: ${NetworkForce}`)

const NetworkAnalysisVisualizationContainer = (): JSX.Element => {
  const classes = useStyles()

  const {
    colorCodeNodes,
    graphRef,
    graphStats,
    graphTooltipInfo,
    isDisplayIsolated,
    isDisplayLabels,
    labelNodeSizeThreshold,
    nodeScalerParams,
    nodeScalingMethod
  } = useContext(NetworkGraphContext) // prettier-ignore

  const graphContainerRef = useRef<HTMLDivElement>()

  const graphBoxSize = useBoxSize(graphContainerRef)

  return (
    <div className={classes.visualizationContainer}>
      <div className={classes.left}>
        <GraphStatsPanel graphStats={graphStats} />

        <VisualizationSettings />
      </div>

      <div className={classes.right}>
        <div ref={graphContainerRef} className={classes.graphContainer}>
          {graphTooltipInfo != null && (
            <NodeTooltip
              position={{
                left: graphTooltipInfo.mouseCoordinates.x,
                top: graphTooltipInfo.mouseCoordinates.y
              }}
              label={graphTooltipInfo.nodeMetadata.label}
              scalingMethod={nodeScalingMethod}
              scalingValue={graphTooltipInfo.nodeMetadata.scalerActualValue}
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
            width={graphBoxSize?.width ?? 0}
            height={graphBoxSize?.height ?? 0}
            ref={graphRef}
          />
        </div>
      </div>
    </div>
  )
}

export default NetworkAnalysisVisualizationContainer
