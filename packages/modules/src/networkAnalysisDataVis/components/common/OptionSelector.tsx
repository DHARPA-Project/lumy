import React from 'react'

import { Grid, FormControl, NativeSelect, Typography } from '@material-ui/core'

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import useStyles from './OptionSelector.styles'

export interface Option {
  value: string
  label: string
}

export interface OptionSelectorProps {
  value: string
  values: Option[]
  label: string
  onValueChanged?: (value: string) => void
  infoText?: string
}

export const OptionSelector = ({
  label,
  value,
  values,
  onValueChanged
}: OptionSelectorProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Grid container direction="row" alignItems="center" classes={{ root: classes.labelRoot }}>
        <Typography variant="caption">{label}</Typography>
        <InfoOutlinedIcon color="inherit" classes={{ root: classes.infoIcon }} />
      </Grid>

      <FormControl classes={{ root: classes.formControlRoot }}>
        <NativeSelect
          classes={{ root: classes.nativeSelectRoot }}
          value={value}
          onChange={e => onValueChanged?.(e.target.value)}
        >
          {values.map(({ value, label }) => (
            <option value={value} key={value ?? ''}>
              {label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
    </div>
  )
}
