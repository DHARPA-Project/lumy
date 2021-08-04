import React from 'react'
import { Box, MenuItem, TextField } from '@material-ui/core'

export interface ModuleSelectorProps extends React.HTMLAttributes<HTMLElement> {
  moduleId: string | undefined
  setModuleId: (moduleId: string | undefined) => void
}

export const ModuleSelector = ({ moduleId, setModuleId, ...rest }: ModuleSelectorProps): JSX.Element => {
  const moduleIds = window.__lumy_dynamicComponentsRegistry?.ids ?? []
  return (
    <Box justifyContent="space-around" display="flex" {...rest}>
      <TextField
        id="outlined-select-currency"
        select
        label="Module"
        value={moduleId ?? ''}
        onChange={e => setModuleId(e.target.value as string)}
        // helperText="Select module"
        variant="outlined"
      >
        {moduleIds.map(id => (
          <MenuItem value={id} key={id}>
            {id}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}
