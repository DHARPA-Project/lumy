import React from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'

export interface FilterTopologyLayoutProps {
  isDisplayIsolated: boolean
  onDisplayIsolatedUpdated?: (isIsolated: boolean) => void
}

/**
 * Filter / topology / layout control properties
 */
export const FilterTopologyLayout = ({
  isDisplayIsolated,
  onDisplayIsolatedUpdated
}: FilterTopologyLayoutProps): JSX.Element => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={!isDisplayIsolated}
          onChange={() => onDisplayIsolatedUpdated?.(!isDisplayIsolated)}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      }
      label="Remove isolated nodes"
    />
  )
}
