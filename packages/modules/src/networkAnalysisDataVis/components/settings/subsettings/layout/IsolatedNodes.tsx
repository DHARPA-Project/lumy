import React, { useContext } from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { NetworkGraphContext } from '../../../../context'

const IsolatedNodes = (): JSX.Element => {
  const { isDisplayIsolated, setIsDisplayIsolated } = useContext(NetworkGraphContext)

  return (
    <FormControlLabel
      control={
        <Checkbox
          color="primary"
          checked={!isDisplayIsolated}
          onChange={() => setIsDisplayIsolated?.(!isDisplayIsolated)}
        />
      }
      label="remove isolated nodes"
    />
  )
}

export default IsolatedNodes
