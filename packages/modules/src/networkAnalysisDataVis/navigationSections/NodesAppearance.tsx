import React from 'react'
import { Grid, FormControl, Slider, NativeSelect, Typography } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { ScalingMethods } from '../structure'

type NodesColor = 'useGroup' | 'noColor'

export interface NodeAppearanceProps {
  nodesScalingMethod: ScalingMethods
  onNodesScalingMethodUpdated?: (m: ScalingMethods) => void

  isDisplayLabels: boolean
  onDisplayLabelsUpdated?: (isDisplayLabels: boolean) => void

  nodesColor: NodesColor
  onNodesColorUpdated?: (nodesColor: NodesColor) => void

  nodesSizeThresholdBoundaries: [number, number]
}

/**
 * Nodes appearance control panel
 */
export const NodesAppearance = ({
  nodesScalingMethod,
  onNodesScalingMethodUpdated,
  isDisplayLabels,
  onDisplayLabelsUpdated,
  nodesColor,
  onNodesColorUpdated,
  nodesSizeThresholdBoundaries
}: NodeAppearanceProps): JSX.Element => {
  const [labelValue, setLabelValue] = React.useState(null)

  console.log(`nodesSizeThresholdBoundaries: ${nodesSizeThresholdBoundaries}`)

  return (
    <Grid container direction="column">
      {/* size */}
      <Grid item>
        <Grid container direction="row" alignItems="center" style={{ paddingBottom: '.5em' }}>
          <Typography className="accordion-sub">Size</Typography>
          <InfoOutlinedIcon color="inherit" className="vizIconRight" />
        </Grid>

        <FormControl>
          <NativeSelect
            style={{
              borderBottom: '0px',
              borderRadius: 1,
              paddingLeft: '.5em',
              border: '1px solid #ced4da'
            }}
            value={nodesScalingMethod ?? ''}
            onChange={e => onNodesScalingMethodUpdated?.(e.target.value as ScalingMethods)}
          >
            <option value="equal">Equal</option>
            <option value="degree">Most connections to other nodes (hubs)</option>
            <option value="betweenness">Bridges between groups of nodes (brokers)</option>
            <option value="eigenvector">Best connected to hubs</option>
          </NativeSelect>
        </FormControl>
      </Grid>

      {/* labels */}
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          style={{ paddingBottom: '.5em', marginTop: '1.5em' }}
        >
          <Typography className="accordion-sub">Labels</Typography>
          <InfoOutlinedIcon color="inherit" className="vizIconRight" />
        </Grid>

        <FormControl style={{ width: '100%' }}>
          <NativeSelect
            style={{
              width: '100%',
              borderBottom: '0px',
              borderRadius: 1,
              paddingLeft: '.5em',
              border: '1px solid #ced4da'
            }}
            value={labelValue ?? undefined}
            onChange={e => {
              e.target.value == 'none' ? onDisplayLabelsUpdated?.(false) : onDisplayLabelsUpdated?.(true)
              setLabelValue(e.target.value)
            }}
          >
            <option value="none">None</option>
            <option value="label">Label</option>
          </NativeSelect>
        </FormControl>

        {isDisplayLabels == true && (
          <>
            <Typography style={{ paddingTop: '1em', textAlign: 'left' }}>
              {' '}
              Nodes scaler threshold to display labels
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs>
                <Slider defaultValue={0} min={0} max={3} />
              </Grid>
              <Grid item>{0}</Grid>
            </Grid>
          </>
        )}
      </Grid>

      {/* colors */}
      <Grid item>
        <Grid
          container
          direction="row"
          alignItems="center"
          style={{ paddingBottom: '.5em', marginTop: '1.5em' }}
        >
          <Typography className="accordion-sub">Colors</Typography>
          <InfoOutlinedIcon color="inherit" className="vizIconRight" />
        </Grid>
        <FormControl style={{ width: '100%' }}>
          <NativeSelect
            style={{
              borderBottom: '0px',
              borderRadius: 1,
              paddingLeft: '.5em',
              border: '1px solid #ced4da'
            }}
            value={nodesColor ?? ''}
            onChange={e => onNodesColorUpdated?.(e.target.value as NodesColor)}
          >
            <option value="same">Same for all nodes</option>
            <option value="language">Language</option>
          </NativeSelect>
        </FormControl>
      </Grid>
    </Grid>
  )
}
