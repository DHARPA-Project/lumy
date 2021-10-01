import React, { useEffect, useRef, useState } from 'react'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from '@material-ui/core/TablePagination'
import InputAdornment from '@material-ui/core/InputAdornment'
import Checkbox from '@material-ui/core/Checkbox'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Badge from '@material-ui/core/Badge'

import BackupIcon from '@material-ui/icons/Backup'
import Search from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
import ViewWeekIcon from '@material-ui/icons/ViewWeek'
import FilterListIcon from '@material-ui/icons/FilterList'

import { FormattedMessage, useIntl } from '@lumy/i18n'
import { withI18n } from '../../locale'

import useStyles from './InteractiveTable.styles'
import {
  extractListUniqueValues,
  // genMockStringList,
  getFilteredObjectList,
  getSearchedObjectList,
  getSortedObjectList
} from '../utils'

import InteractiveTableRow from './TableRow'
import ColumnSelection from './ColumnSelection'
import TableFilters from './TableFilters'

export interface ITableItem {
  id: string
  [x: string]: number | string | string[]
}

export type TableColumnFilterTypes = 'multi-string-include' | null

export interface ColumnMap {
  key: string
  label: string
  visible?: boolean
  sortable?: boolean
  searchable?: boolean
  numeric?: boolean
  filterType?: TableColumnFilterTypes
}

export interface FilterableColumn extends ColumnMap {
  filterOptions: string[]
  filterValue: string | string[]
  isOpen: boolean
  isProcessing: boolean
}

type InteractiveTableProps = {
  title: string
  rowList: ITableItem[]
  columnMapList: ColumnMap[]
  isSearchEnabled: boolean
  onDeleteSelectedItems: (idList: string[]) => void
  onAddItemClick?: () => void
  onEditItemClick?: (itemId: string) => void
  defaultNumberRowsPerPage?: number
  searchDebounceDuration?: number // time span (in milliseconds) to debounce search query update
  getItemContentPreview?: (id: string) => JSX.Element
}

const InteractiveTableComponent = ({
  title,
  rowList,
  columnMapList,
  isSearchEnabled,
  onDeleteSelectedItems,
  onAddItemClick,
  onEditItemClick,
  getItemContentPreview,
  defaultNumberRowsPerPage = 10,
  searchDebounceDuration = 200
}: InteractiveTableProps): JSX.Element => {
  const classes = useStyles()
  const intl = useIntl()

  const searchBarRef = useRef(null)
  const searchTimeoutRef = useRef(null)

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  // value of search input field, as visible to the user
  const [searchInputValue, setSearchInputValue] = useState('')
  // trimmed and lowercased search query saved after (optional) debounce period
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  // const [tableColumns, setTableColumns] = useState<ColumnMap[]>(columnMapList)
  const [popoverContent, setPopoverContent] = useState<'columns' | 'filter'>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortingOrder, setSortingOrder] = useState<'asc' | 'desc'>('asc')
  const [sortingColumn, setSortingColumn] = useState<string>(null)
  const [isNumericSort, setIsNumericSort] = useState(false)
  const [numRowsPerPage, setNumRowsPerPage] = useState(defaultNumberRowsPerPage)
  const [pageNumber, setPageNumber] = useState(0)
  const [tableColumns, setTableColumns] = useState<FilterableColumn[]>(() =>
    columnMapList.reduce(
      (acc, column) => [
        ...acc,
        {
          ...column,
          filterOptions: null,
          filterValue: [],
          isOpen: false,
          isProcessing: false
        }
      ],
      []
    )
  )

  const filterableColumns = tableColumns.filter(column => column?.visible && column?.filterType != null)
  const filterList = filterableColumns.reduce((acc, { key, filterType, filterValue }) => {
    return key && filterType && filterValue?.length
      ? acc.concat({ key, type: filterType, value: filterValue })
      : acc
  }, [])

  const searchedRowList = getSearchedObjectList({ objectList: rowList, searchQuery })
  const filteredRowList = getFilteredObjectList({ objectList: searchedRowList, filterList })
  const sortedList =
    sortingColumn && sortingOrder
      ? getSortedObjectList({
          objectList: filteredRowList,
          propertyToSortBy: sortingColumn,
          isNumeric: isNumericSort,
          sortingOrder
        })
      : filteredRowList
  // numRowsPerPage == -1 stands for "all entries" in Material UI TablePagination
  const paginatedRowList =
    numRowsPerPage === -1
      ? (sortedList ?? []).slice(numRowsPerPage * pageNumber)
      : (sortedList ?? []).slice(numRowsPerPage * pageNumber, numRowsPerPage * (pageNumber + 1))

  const visibleColumns = tableColumns.filter(column => column?.visible)
  const numSelectedItems = selectedItems.length
  const numFilteredItems = filteredRowList.length

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      setPageNumber(0)
      setSearchQuery(searchInputValue.trim().toLowerCase())
    }, searchDebounceDuration)

    return () => clearTimeout(searchTimeoutRef.current)
  }, [searchInputValue])

  useEffect(() => {
    if (isSearchBarVisible) {
      searchBarRef.current.focus()
    } else {
      setSearchInputValue('')
    }
  }, [isSearchBarVisible])

  useEffect(() => {
    const columnsMissingOptions = tableColumns.filter(
      ({ filterOptions, isProcessing, isOpen }) => filterOptions == null && !isProcessing && isOpen
    )
    if (!columnsMissingOptions.length) return

    columnsMissingOptions.forEach(columnMissingOptions => {
      setTableColumns(prevColumns =>
        prevColumns.map(column =>
          column.key === columnMissingOptions.key ? { ...column, isProcessing: true } : column
        )
      )

      new Promise(resolve => {
        const uniqueValues = extractListUniqueValues(rowList, columnMissingOptions.key)
        // const uniqueValues = genMockStringList(1e4, true) // generate huge number of mock values
        // setTimeout(() => resolve(uniqueValues), 1e3) // simulate processing time
        resolve(uniqueValues)
      })
        .then(filterOptions => {
          setTableColumns(prevColumns =>
            prevColumns.map(column =>
              column.key === columnMissingOptions.key
                ? { ...column, isProcessing: false, filterOptions: filterOptions as string[] }
                : column
            )
          )
        })
        .catch(error => console.error(error))
    })
  }, [tableColumns])

  const toggleSearchBarVisibile = (value?: boolean) => {
    setIsSearchBarVisible(previousValue => (value ? value : !previousValue))
  }

  const handleSortClick = (column: ColumnMap) => {
    setSortingOrder(sortingColumn === column.key && sortingOrder === 'asc' ? 'desc' : 'asc')
    setSortingColumn(column.key)
    setIsNumericSort(!!column?.numeric)
  }

  const handleColumnToggle = (columnKey: string) => {
    setTableColumns(prevColumns =>
      prevColumns.map(column =>
        column.key === columnKey ? { ...column, visible: !column?.visible } : column
      )
    )
  }

  const handleOpenSelect = (columnKey: string): void => {
    setTableColumns(prevColumns =>
      prevColumns.map(column => (column.key === columnKey ? { ...column, isOpen: true } : column))
    )
  }

  const handleCloseSelect = (columnKey: string): void => {
    setTableColumns(prevColumns =>
      prevColumns.map(column => (column.key === columnKey ? { ...column, isOpen: false } : column))
    )
  }

  const setFilterValue = (columnKey: string) => (filterValue: string | string[]): void => {
    setPageNumber(0)
    setTableColumns(prevColumns =>
      prevColumns.map(column => (column.key === columnKey ? { ...column, filterValue } : column))
    )
  }

  const resetFilterValues = (): void => {
    setPageNumber(0)
    setTableColumns(prevColumns => prevColumns.map(column => ({ ...column, filterValue: [] })))
  }

  const handleSelectClick = (id: string) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedItem => selectedItem !== id)
        : [...prevSelected, id]
    )
  }

  const handleSelectAllClick = () => {
    setSelectedItems(prevSelected =>
      prevSelected.length === numFilteredItems ? [] : filteredRowList.map(item => item.id as string)
    )
  }

  const handlePageNumberChange = (event: unknown, newPageNumber: number) => {
    setPageNumber(newPageNumber)
  }

  const handleNumRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumRowsPerPage(+event.target.value)
    setPageNumber(0)
  }

  return (
    <Paper classes={{ root: classes.interactiveTableContainer }}>
      <Toolbar className={classes.tableToolbar + ` ${+numSelectedItems > 0 ? classes.highlight : ''}`}>
        <div className={classes.left}>
          {numSelectedItems > 0 ? (
            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
              <FormattedMessage
                id="interactiveTable.message.itemsSelected"
                values={{ count: numSelectedItems }}
              />
            </Typography>
          ) : isSearchEnabled && isSearchBarVisible ? (
            <TextField
              name="search"
              value={searchInputValue}
              onChange={event => setSearchInputValue(event.target.value)}
              classes={{ root: classes.search }}
              inputRef={searchBarRef}
              variant="outlined"
              label={<FormattedMessage id="interactiveTable.toolbar.search.label" />}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => toggleSearchBarVisibile(false)}
                      aria-label="toggle search visibility"
                      size="small"
                      edge="end"
                    >
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          ) : (
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
              {title}
            </Typography>
          )}
        </div>

        <div className={classes.right}>
          {numSelectedItems > 0 ? (
            <Tooltip title={<FormattedMessage id="interactiveTable.toolbar.delete.tooltip" />}>
              <IconButton onClick={() => onDeleteSelectedItems(selectedItems)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title={<FormattedMessage id="interactiveTable.toolbar.search.tooltip" />}>
                <IconButton onClick={() => toggleSearchBarVisibile()} aria-label="search items">
                  <Search />
                </IconButton>
              </Tooltip>

              <Tooltip title={<FormattedMessage id="interactiveTable.toolbar.chooseColumns.tooltip" />}>
                <IconButton
                  onClick={event => {
                    setPopoverContent('columns')
                    setPopoverAnchorEl(event.currentTarget)
                  }}
                  aria-label="choose visible columns"
                >
                  <ViewWeekIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={<FormattedMessage id="interactiveTable.toolbar.filterList.tooltip" />}>
                <IconButton
                  onClick={event => {
                    setPopoverContent('filter')
                    setPopoverAnchorEl(event.currentTarget)
                  }}
                  aria-label="filter list"
                >
                  <Badge //prettier-ignore
                    badgeContent={filterList.length}
                    // variant="dot"
                    variant="standard"
                    color="secondary"
                  >
                    <FilterListIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title={<FormattedMessage id="interactiveTable.toolbar.addNewItem.tooltip" />}>
                <IconButton onClick={() => onAddItemClick()} aria-label="add new item">
                  <BackupIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
      </Toolbar>

      <Popover
        anchorEl={popoverAnchorEl}
        open={!!popoverAnchorEl}
        onClose={() => setPopoverAnchorEl(null)}
        id={!!popoverAnchorEl ? 'interactive-table-column-list-popover' : null}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {popoverContent === 'columns' ? (
          <ColumnSelection columns={tableColumns} toggleColumn={handleColumnToggle} />
        ) : popoverContent === 'filter' ? (
          <TableFilters
            columns={filterableColumns}
            handleOpenSelect={handleOpenSelect}
            handleCloseSelect={handleCloseSelect}
            setFilterValue={setFilterValue}
            resetFilterValues={resetFilterValues}
          />
        ) : null}
      </Popover>

      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} stickyHeader aria-label="table sticky">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" className={classes.tableHeadCell}>
                <Checkbox
                  indeterminate={numSelectedItems > 0 && numSelectedItems < numFilteredItems}
                  checked={numFilteredItems > 0 && numFilteredItems === numSelectedItems}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'select all items' }}
                />
              </TableCell>

              {visibleColumns.map((column, index) => (
                <TableCell
                  align="center"
                  className={classes.tableHeadCell}
                  key={`column-heading-${column.key ?? index}`}
                >
                  {column?.sortable ? (
                    <TableSortLabel
                      active={column?.sortable && sortingColumn && sortingColumn === column.key}
                      direction={sortingColumn === column.key ? sortingOrder : 'asc'}
                      onClick={() => handleSortClick(column)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}

              {(onEditItemClick || getItemContentPreview) && (
                <TableCell align="center" className={classes.tableHeadCell}>
                  <FormattedMessage id="interactiveTable.header.controls" />
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBody}>
            {paginatedRowList.map((item, index) => (
              <InteractiveTableRow
                key={(item.id as string) ?? index}
                item={item}
                columns={visibleColumns}
                isSelected={selectedItems.includes(item.id as string)}
                onSelectionChange={() => handleSelectClick(item.id as string)}
                onEditItemClick={onEditItemClick}
                contentPreview={getItemContentPreview ? getItemContentPreview(item.id as string) : null}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        className={classes.pagination}
        component="div"
        count={numFilteredItems ?? 0}
        page={pageNumber}
        rowsPerPage={numRowsPerPage}
        rowsPerPageOptions={[
          5,
          10,
          25,
          { label: intl.formatMessage({ id: 'interactiveTable.pagination.all' }), value: -1 }
        ]}
        onChangePage={handlePageNumberChange}
        onChangeRowsPerPage={handleNumRowsPerPageChange}
      />
    </Paper>
  )
}

const InteractiveTable = withI18n(InteractiveTableComponent)

export { InteractiveTable }
