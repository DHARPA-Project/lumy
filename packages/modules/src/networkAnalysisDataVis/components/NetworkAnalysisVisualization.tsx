import React, { useContext, useRef } from 'react'

import { NetworkForce } from '@lumy/datavis-components'
import { useElementSize } from '@lumy/client-ui'

import { NetworkGraphContext } from '../context'
import { normalizedValue } from '../utils'
import useStyles from './NetworkAnalysisVisualization.styles'

import { NodeTooltip } from './NodeTooltip'
import { GraphStatsPanel } from './statistics/GraphStatsPanel'
import VisualizationSettings from './settings/VisualizationSettings'

console.debug(`Registering visualisation component: ${NetworkForce}`)

const NetworkAnalysisVisualizationContainer = (): JSX.Element => {
  const classes = useStyles()

  const {
    colorCodeNodes,
    graphRef,
    isDisplayIsolated,
    isDisplayLabels,
    labelNodeSizeThreshold,
    nodeScalerParams
  } = useContext(NetworkGraphContext) // prettier-ignore

  const graphContainerRef = useRef<HTMLDivElement>()

  const graphBoxSize = useElementSize(graphContainerRef)

  return (
    <div className={classes.visualizationContainer}>
      <div className={classes.left}>
        <GraphStatsPanel />

        <VisualizationSettings />
      </div>

      <div className={classes.right}>
        <div ref={graphContainerRef} className={classes.graphContainer}>
          <NodeTooltip />

          <network-force
            displayIsolatedNodes={isDisplayIsolated ? undefined : true}
            displayLabels={isDisplayLabels ? undefined : false}
            colorCodeNodes={colorCodeNodes ? undefined : false}
            labelNodeSizeThreshold={normalizedValue(
              labelNodeSizeThreshold,
              nodeScalerParams.min,
              nodeScalerParams.max
            )}
            reapplySimulationOnUpdate={false}
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
