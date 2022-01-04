import React, { ChangeEvent } from 'react'

import Switch from '@material-ui/core/Switch'

import useStyles from './CustomSwitch.styles'

type CustomSwitchProps = {
  checked: boolean
  handleChange: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

export const CustomSwitch = ({ checked, handleChange }: CustomSwitchProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      color="primary"
    />
  )
}
