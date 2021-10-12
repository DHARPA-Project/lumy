import React, { useContext } from 'react'

import useStyles from './NodeTooltip.styles'
import { TooltipContext } from '../context'

/**
 * Tooltip for a network analysis graph node.
 */
export const NodeTooltip = (): JSX.Element => {
  const classes = useStyles()

  const { graphTooltipInfo, nodeScalingMethod } = useContext(TooltipContext)

  const position = {
    left: graphTooltipInfo?.mouseCoordinates.x,
    top: graphTooltipInfo?.mouseCoordinates.y
  }
  const label = graphTooltipInfo?.nodeMetadata?.label
  const scalingValue = graphTooltipInfo?.nodeMetadata?.scalerActualValue
  const group = graphTooltipInfo?.nodeMetadata?.group

  const requiredInfoMissing = !label || !scalingValue || !group || !position?.left || !position?.top

  if (requiredInfoMissing) return null

  return (
    <div
      className={classes.root}
      style={{
        left: position.left + 10,
        top: position.top - 10
      }}
    >
      {label == null ? '' : <span style={{ display: 'block' }}>Label: {label}</span>}

      {!isNaN(scalingValue) && nodeScalingMethod != null ? (
        <span
          style={{ display: 'block', textTransform: 'capitalize' }}
        >{`${nodeScalingMethod}: ${scalingValue.toFixed(2)}`}</span>
      ) : (
        ''
      )}

      {group != null ? <span style={{ display: 'block' }}>Group: {group}</span> : ''}
    </div>
  )
}
