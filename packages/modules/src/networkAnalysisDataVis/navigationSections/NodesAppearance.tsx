import React from 'react'
import { Grid, Slider, Typography } from '@material-ui/core'
import { ScalingMethod } from '../structure'
import { OptionSelector, Option } from '../components/OptionSelector'

const scalingMethodLabels: Record<ScalingMethod, string> = {
  degree: 'Most connections to other nodes (hubs)',
  betweenness: 'Bridges between groups of nodes (brokers)',
  eigenvector: 'Best connected to hubs'
}
const scalingMethodValues: Option[] = [{ value: undefined, label: 'Equal' }].concat(
  Object.entries(scalingMethodLabels).map(([value, label]) => ({ value, label }))
)

const displayLabelValues: Option[] = [
  { value: String(true), label: 'Label' },
  { value: String(false), label: 'None' }
]

const colorCodeNodesValues: Option[] = [
  { value: String(true), label: 'By group' },
  { value: String(false), label: 'Same for all nodes' }
]

export interface NodeAppearanceProps {
  nodesScalingMethod: ScalingMethod
  onNodesScalingMethodUpdated?: (m: ScalingMethod) => void

  isDisplayLabels: boolean
  onDisplayLabelsUpdated?: (isDisplayLabels: boolean) => void

  colorCodeNodes: boolean
  onColorCodeNodesUpdated?: (colorCodeNodes: boolean) => void

  labelNodeSizeThreshold?: number
  onLabelNodeSizeThresholdUpdated?: (labelNodeSizeThreshold: number) => void
  labelNodesSizeThresholdBoundaries?: [number, number, number]
}

/**
 * Nodes appearance control panel
 */
export const NodesAppearance = ({
  nodesScalingMethod,
  onNodesScalingMethodUpdated,
  isDisplayLabels,
  onDisplayLabelsUpdated,
  colorCodeNodes,
  onColorCodeNodesUpdated,
  labelNodeSizeThreshold,
  onLabelNodeSizeThresholdUpdated,
  labelNodesSizeThresholdBoundaries
}: NodeAppearanceProps): JSX.Element => {
  return (
    <Grid container direction="column">
      {/* size */}
      <Grid item>
        <OptionSelector
          value={nodesScalingMethod}
          onValueChanged={v => onNodesScalingMethodUpdated?.(v as ScalingMethod)}
          label="Size"
          values={scalingMethodValues}
        />
      </Grid>

      {/* labels */}
      <Grid item>
        <OptionSelector
          value={String(isDisplayLabels)}
          onValueChanged={v => onDisplayLabelsUpdated?.(v === String(true))}
          label="Label"
          values={displayLabelValues}
        />

        {isDisplayLabels == true && (
          <Grid item>
            <Typography style={{ paddingTop: '1em', textAlign: 'left' }}>
              Display nodes of at least this size
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs>
                <Slider
                  value={labelNodeSizeThreshold ?? 0.8}
                  onChange={(_, v) => onLabelNodeSizeThresholdUpdated?.(v as number)}
                  min={labelNodesSizeThresholdBoundaries?.[0] ?? 0}
                  max={labelNodesSizeThresholdBoundaries?.[1] ?? 1}
                  step={labelNodesSizeThresholdBoundaries?.[2] ?? 0.1}
                />
              </Grid>
              <Grid item>{labelNodeSizeThreshold ?? 0.8}</Grid>
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* colors */}
      <Grid item>
        <OptionSelector
          value={String(colorCodeNodes)}
          onValueChanged={v => onColorCodeNodesUpdated?.(v === String(true))}
          label="Colors"
          values={colorCodeNodesValues}
        />
      </Grid>
    </Grid>
  )
}
