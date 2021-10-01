import React from 'react'

import ListSubheader from '@material-ui/core/ListSubheader'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'

import Autocomplete, { AutocompleteRenderGroupParams } from '@material-ui/lab/Autocomplete'

import useStyles from './VirtualizedSelect.styles'
import ListBox from './VirtualizedListBox'
import { FormattedMessage } from 'react-intl'

const renderGroup = (params: AutocompleteRenderGroupParams) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children
]

interface VSFProps {
  label: string
  isOpen: boolean
  handleOpen: () => void
  handleClose: () => void
  isProcessing?: boolean
  options: string[]
  allowMultipleChoice?: boolean
  value: string | string[]
  setFilterValue: (filterValue: string | string[]) => void
}

const VirtualizedSelectField = ({
  label,
  isOpen,
  handleOpen,
  handleClose,
  isProcessing,
  options,
  allowMultipleChoice,
  value,
  setFilterValue
}: VSFProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Autocomplete
      value={value}
      onChange={(event, value) => setFilterValue(value as string | string[])}
      classes={classes}
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
      loading={isProcessing}
      loadingText={<FormattedMessage id="virtualizedSelect.loadingText" />}
      options={options ?? []}
      groupBy={option => option[0].toUpperCase()}
      renderGroup={renderGroup}
      ListboxComponent={ListBox as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
      renderOption={option => <Typography noWrap>{option}</Typography>}
      multiple={allowMultipleChoice}
      disableListWrap
      limitTags={3}
      size="small"
      handleHomeEndKeys={true}
      openOnFocus={true}
      noOptionsText={<FormattedMessage id="virtualizedSelect.noOptionsText" />}
      renderInput={params => (
        <TextField
          {...params}
          fullWidth={false}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isProcessing ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
          variant="outlined"
          label={label}
        />
      )}
    />
  )
}

export default VirtualizedSelectField
