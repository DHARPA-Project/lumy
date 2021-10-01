import React from 'react'

import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'

import ReplayIcon from '@material-ui/icons/Replay'

import useStyles from './TableFilters.styles'
import { FilterableColumn } from './InteractiveTable'

import VirtualizedSelectField from '../../virtualized-select/VirtualizedSelect'
import { FormattedMessage } from 'react-intl'

type TableFiltersProps = {
  columns: FilterableColumn[]
  handleOpenSelect: (columnKey: string) => void
  handleCloseSelect: (columnKey: string) => void
  setFilterValue: (columnKey: string) => (filterValue: string | string[]) => void
  resetFilterValues: () => void
}

const TableFilters = ({
  columns,
  handleOpenSelect,
  handleCloseSelect,
  setFilterValue,
  resetFilterValues
}: TableFiltersProps): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.filterContainer}>
      <div className={classes.header}>
        <Typography variant="body2" className={classes.title}>
          <FormattedMessage id="interactiveTable.toolbar.filterList.panel.title" />
        </Typography>

        <Tooltip title={<FormattedMessage id="interactiveTable.toolbar.filterList.panel.resetFilters" />}>
          <IconButton onClick={resetFilterValues} aria-label="reset filters" size="small">
            <ReplayIcon />
          </IconButton>
        </Tooltip>
      </div>

      {!columns?.length ? (
        <Card className={classes.card}>
          <Typography variant="subtitle2" component="h3" align="center">
            <FormattedMessage id="interactiveTable.toolbar.filterList.panel.noFilters" />
          </Typography>
        </Card>
      ) : (
        <List
          component="ul"
          aria-labelledby="list-subheader"
          subheader={
            <ListSubheader component="div" disableGutters={true}>
              <FormattedMessage id="interactiveTable.toolbar.filterList.panel.explanation" />
            </ListSubheader>
          }
        >
          {columns.map((column, index) => (
            <ListItem component="li" key={column.key ?? index} disableGutters={true}>
              {column?.filterType === 'multi-string-include' && !column?.numeric && (
                <VirtualizedSelectField
                  label={column.label}
                  isOpen={column.isOpen}
                  handleOpen={() => handleOpenSelect(column.key)}
                  handleClose={() => handleCloseSelect(column.key)}
                  isProcessing={column.isProcessing}
                  options={column.filterOptions}
                  allowMultipleChoice={true}
                  value={column.filterValue}
                  setFilterValue={setFilterValue(column.key)}
                />
              )}
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}

export default TableFilters
