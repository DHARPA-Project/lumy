import React from 'react'
import { TextField } from '@material-ui/core'
import { LumyAutoUiComponentProps, lumyDefaultAutoUiElement } from '../registry'

export const DefaultInputElement = ({ metadata }: LumyAutoUiComponentProps): JSX.Element => {
  return <TextField label={`${metadata?.name} (default component)`} variant="outlined" />
}

lumyDefaultAutoUiElement('input')(DefaultInputElement)
