import React, { useContext } from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Slider from '@material-ui/core/Slider'

import useStyles from './NodeLabel.styles'

import { OptionSelector, Option } from '../../../common/OptionSelector'
import { NetworkGraphContext } from '../../../../context'

const displayLabelValues: Option[] = [
  { value: String(true), label: 'label' },
  { value: String(false), label: 'none' }
]

const NodeLabel = (): JSX.Element => {
  const classes = useStyles()

  const {
    isDisplayLabels,
    labelNodeSizeThreshold,
    nodeScalerParams,
    setIsDisplayLabels,
    setLabelNodeSizeThreshold
  } = useContext(NetworkGraphContext)

  return (
    <>
      <OptionSelector
        value={String(isDisplayLabels)}
        onValueChanged={v => setIsDisplayLabels?.(v === String(true))}
        label="label"
        values={displayLabelValues}
      />

      {isDisplayLabels == true && (
        <Grid item>
          <Typography className={classes.header}>Display labels for nodes of at least this size</Typography>
          <Grid container spacing={2}>
            <Grid item xs>
              <Slider
                value={labelNodeSizeThreshold}
                onChange={(_, v) => setLabelNodeSizeThreshold?.(v as number)}
                min={nodeScalerParams.min}
                max={nodeScalerParams.max}
                step={nodeScalerParams.step}
              />
            </Grid>
            <Grid item>{labelNodeSizeThreshold?.toFixed(2)}</Grid>
          </Grid>
        </Grid>
      )}
    </>
  )
}

export default NodeLabel
