import React, { useState } from 'react'

import Box from '@material-ui/core/Box'
import Grow from '@material-ui/core/Grow'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Collapse from '@material-ui/core/Collapse'
import Tooltip from '@material-ui/core/Tooltip'
import Popover from '@material-ui/core/Popover'

import { useDataRepositoryItemValue } from '@lumy/client-core'
import { LoadingIndicator, TableView } from '@lumy/common-ui-components'

import useStyles from './TabularDataMappingRow.styles'

export interface IRequiredDataSet {
  name: string
  requiredFields: string[]
}

type TabularDataMappingRowProps = {
  rowId: string
  rowName: string
  columnNames: string[]
  requiredDataSets: IRequiredDataSet[]
  isDataSetMappedInDataSource: (dataSourceId: string, dataSetName: string) => boolean
  getColumnMappedToField: (dataSourceId: string, fieldName: string) => string
  clearMappingsForDataSet: (dataSourceId: string, dataSetName: string) => void
  setColumnMappedToField: (dataSourceId: string, fieldName: string, columnName: string) => void
}

const TabularDataMappingRow = ({
  rowId,
  rowName,
  columnNames,
  requiredDataSets,
  isDataSetMappedInDataSource,
  getColumnMappedToField,
  clearMappingsForDataSet,
  setColumnMappedToField
}: TabularDataMappingRowProps): JSX.Element => {
  const classes = useStyles()

  const [
    dataSourceContentTable,
    dataSourceContentMetadata
  ] = useDataRepositoryItemValue(rowId, { pageSize: 5}) // prettier-ignore

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  // When the user toggles the checkbox that marks the current resource as a source of required data...
  // (e.g. when the user selects this resource as a source of nodes or edges for network analysis)
  const handleToggleIsSourceOfDataSet = (toggledDataSetName: string): void => {
    // ... clear previous error message...
    setErrorMessage('')

    // if the toggled data set was previously selected and is now being disabled...
    if (isDataSetMappedInDataSource(rowId, toggledDataSetName)) {
      //... clear the field-column mapping in context
      clearMappingsForDataSet(rowId, toggledDataSetName)
    } else {
      // ... otherwise, give the underlying fields a blank string value to make them visible
      const dataSet = requiredDataSets.find(dataSet => dataSet.name === toggledDataSetName)
      const requiredFields = dataSet?.requiredFields ?? []
      requiredFields.forEach(fieldName => setColumnMappedToField(rowId, fieldName, undefined))
    }
  }

  // Sets the selected column as source of data for the specified required field
  const handleFieldSelection = (fieldName: string, selectedColumn: string): void => {
    // clear error message and save the value of the selected column
    setErrorMessage('')
    setColumnMappedToField(rowId, fieldName, selectedColumn)
  }

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setPopoverAnchorEl(null)
  }

  const isPopoverOpen = Boolean(popoverAnchorEl)
  const popoverId = isPopoverOpen ? 'data-source-content-preview-popover' : undefined

  return (
    <>
      <TableRow className={classes.row}>
        <TableCell className={classes.tableCell}>
          <Tooltip arrow title="click to open content preview">
            <span onClick={handleOpenPopover}>{rowName}</span>
          </Tooltip>

          <Popover
            anchorEl={popoverAnchorEl}
            open={isPopoverOpen}
            id={popoverId}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            {dataSourceContentTable ? (
              <TableView table={dataSourceContentTable} tableStats={dataSourceContentMetadata} />
            ) : (
              <LoadingIndicator />
            )}
          </Popover>
        </TableCell>

        {requiredDataSets.map(dataSet => (
          <TableCell className={classes.tableCell} key={dataSet.name}>
            <div className={classes.cellContainer}>
              <Checkbox
                className={classes.checkbox}
                color="primary"
                checked={isDataSetMappedInDataSource(rowId, dataSet.name)}
                onChange={() => handleToggleIsSourceOfDataSet(dataSet.name)}
              />

              <Grow
                in={isDataSetMappedInDataSource(rowId, dataSet.name)}
                style={{ transformOrigin: '0 0 0' }}
                {...(isDataSetMappedInDataSource(rowId, dataSet.name) ? { timeout: 1000 } : { timeout: 0 })}
              >
                <Box className={classes.selectContainer}>
                  {dataSet.requiredFields.map(requiredFieldName => (
                    <FormControl
                      className={classes.formControl}
                      variant="outlined"
                      size="small"
                      margin="dense"
                      key={requiredFieldName}
                    >
                      <InputLabel>{requiredFieldName}</InputLabel>
                      <Select
                        name={`data-source-${rowId}-${requiredFieldName}-column`}
                        label={requiredFieldName}
                        value={getColumnMappedToField(rowId, requiredFieldName) || ''}
                        onChange={event =>
                          handleFieldSelection(requiredFieldName, event.target.value as string)
                        }
                        autoWidth
                      >
                        {columnNames.map((columnName, index) => (
                          <MenuItem key={index} value={columnName}>
                            {columnName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                </Box>
              </Grow>
            </div>
          </TableCell>
        ))}
      </TableRow>

      <TableRow className={classes.row}>
        <TableCell className={classes.errorCell} colSpan={requiredDataSets.length + 1}>
          <Collapse in={!!errorMessage} appear={!!errorMessage} timeout={300}>
            <Box margin={1}>
              <FormHelperText className={classes.errorMessage}>{errorMessage}</FormHelperText>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default TabularDataMappingRow
