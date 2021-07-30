import React from 'react'

import NativeSelect from '@material-ui/core/NativeSelect'
import Typography from '@material-ui/core/Typography'

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import useStyles from './OptionSelector.styles'

export interface Option {
  value: string
  label: string
}

export interface OptionSelectorProps {
  value: string
  options: Option[]
  label: string
  onValueChanged?: (value: string) => void
  documentationId?: string
  infoText?: string
}

export const OptionSelector = ({
  label,
  value,
  options,
  onValueChanged
}: OptionSelectorProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.optionSelectorContainer}>
      <div>
        <Typography variant="caption">{label}</Typography>
        <InfoOutlinedIcon color="disabled" fontSize="small" classes={{ root: classes.infoIcon }} />
      </div>

      <NativeSelect
        classes={{ root: classes.nativeSelectRoot }}
        value={value}
        onChange={e => onValueChanged?.(e.target.value)}
        fullWidth
      >
        {options.map(({ value, label }) => (
          <option value={value} key={value ?? ''}>
            {label}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
