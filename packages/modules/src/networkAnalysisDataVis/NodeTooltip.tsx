import React from 'react'
import useStyles from './NodeTooltip.styles'

export interface NodeTooltipProps {
  position: { left: number; top: number }
  label?: string
  scalingMethod?: string
  scalingValue?: number
  group?: string
}

/**
 * Tooltip for a node.
 */
export const NodeTooltip = ({
  position,
  label,
  scalingMethod,
  scalingValue,
  group
}: NodeTooltipProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div
      className={classes.root}
      style={{
        left: position.left + 10,
        top: position.top - 10
      }}
    >
      {label == null ? '' : <span style={{ display: 'block' }}>Label: {label}</span>}
      {!isNaN(scalingValue) && scalingMethod != null ? (
        <span
          style={{ display: 'block', textTransform: 'capitalize' }}
        >{`${scalingMethod}: ${scalingValue.toFixed(2)}`}</span>
      ) : (
        ''
      )}
      {group != null ? <span style={{ display: 'block' }}>Group: {group}</span> : ''}
    </div>
  )
}
