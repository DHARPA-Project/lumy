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

import BackupIcon from '@material-ui/icons/Backup'
import Search from '@material-ui/icons/Search'
import DeleteIcon from '@material-ui/icons/Delete'
import CloseIcon from '@material-ui/icons/Close'
// import FilterListIcon from '@material-ui/icons/FilterList'

import useStyles from './InteractiveTable.styles'

import DataRegistryRow from './TableRow'

type Order = 'asc' | 'desc'

interface IObjectListSortParams {
  objectList: Record<string, string>[]
  propertyToSortBy: string
  sortingOrder: Order
  isNumeric: boolean
}

const sortObjectList = ({ objectList, propertyToSortBy, isNumeric, sortingOrder }: IObjectListSortParams) => {
  const orderFactor = sortingOrder === 'asc' ? 1 : -1
  return [...objectList].sort((a, b) => {
    const first = isNumeric ? parseFloat(a[propertyToSortBy]) : a[propertyToSortBy].trim().toLowerCase()
    const second = isNumeric ? parseFloat(b[propertyToSortBy]) : b[propertyToSortBy].trim().toLowerCase()
    return first > second ? orderFactor : -orderFactor
  })
}

export interface ITableItem {
  id: string
  [x: string]: string
}

export type ColumnMap = {
  label: string
  key: string
  visible: boolean
  sortable: boolean
  numeric: boolean
}

type InteractiveTableProps = {
  title: string
  itemList: ITableItem[]
  columnMapList: ColumnMap[]
  isSearchEnabled: boolean
  onDeleteSelectedItems: (idList: string[]) => void
  onAddItemClick?: () => void
  onEditItemClick?: (itemId: string) => void
  defaultNumberRowsPerPage?: number
  searchDebounceDuration?: number // time span (in milliseconds) to debounce search query update
  getItemContentPreview?: (id: string) => JSX.Element
}

export const InteractiveTable = ({
  title,
  itemList,
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

  const searchBarRef = useRef(null)
  const timeoutRef = useRef(null)

  // value of search input field, as visible to the user
  const [searchInputValue, setSearchInputValue] = useState('')
  // trimmed and lowercased search query saved after (optional) debounce period
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  // const [tableColumns, setTableColumns] = useState<ColumnMap[]>(columnMapList)
  const [tableColumns] = useState<ColumnMap[]>(columnMapList)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [sortingOrder, setSortingOrder] = useState<Order>('asc')
  const [sortingColumn, setSortingColumn] = useState<string>(null)
  const [isNumericSort, setIsNumericSort] = useState(false)
  const [numRowsPerPage, setNumRowsPerPage] = useState(defaultNumberRowsPerPage)
  const [pageNumber, setPageNumber] = useState(0)

  const filteredList = searchQuery
    ? (itemList ?? []).filter(item => (item.label ?? '').toLowerCase().includes(searchQuery))
    : itemList
  const sortedList =
    sortingColumn && sortingOrder
      ? sortObjectList({
          objectList: filteredList,
          propertyToSortBy: sortingColumn,
          isNumeric: isNumericSort,
          sortingOrder
        })
      : filteredList
  const paginatedList = (sortedList ?? []).slice(
    numRowsPerPage * pageNumber,
    numRowsPerPage * (pageNumber + 1)
  )

  const visibleColumns = tableColumns.filter(column => column.visible)
  const numSelectedItems = selectedItems.length
  const numFilteredItems = filteredList.length

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setPageNumber(0)
      setSearchQuery(searchInputValue.trim().toLowerCase())
      setPageNumber(0)
    }, searchDebounceDuration)

    return () => clearTimeout(timeoutRef.current)
  }, [searchInputValue])

  useEffect(() => {
    if (isSearchBarVisible) {
      searchBarRef.current.focus()
    } else {
      setSearchInputValue('')
    }
  }, [isSearchBarVisible])

  const toggleSearchBarVisibile = (value?: boolean) => {
    setIsSearchBarVisible(previousValue => (value ? value : !previousValue))
  }

  const handleSortClick = (column: ColumnMap) => {
    setSortingOrder(sortingColumn === column.key && sortingOrder === 'asc' ? 'desc' : 'asc')
    setSortingColumn(column.key)
    setIsNumericSort(column.numeric)
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
      prevSelected.length === numFilteredItems ? [] : filteredList.map(item => item.id)
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
    <Paper classes={{ root: classes.dataRegistryPaper }}>
      <Toolbar className={classes.toolbar + ` ${+numSelectedItems > 0 ? classes.highlight : ''}`}>
        <div className={classes.left}>
          {numSelectedItems > 0 ? (
            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
              {numSelectedItems} items selected
            </Typography>
          ) : isSearchEnabled && isSearchBarVisible ? (
            <TextField
              name="search"
              value={searchInputValue}
              onChange={event => setSearchInputValue(event.target.value)}
              classes={{ root: classes.search }}
              inputRef={searchBarRef}
              variant="outlined"
              label="search data sources"
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
            <Tooltip title="Delete">
              <IconButton onClick={() => onDeleteSelectedItems(selectedItems)} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <>
              <Tooltip title="search items">
                <IconButton onClick={() => toggleSearchBarVisibile()} aria-label="search items">
                  <Search />
                </IconButton>
              </Tooltip>

              <Tooltip title="add new item">
                <IconButton onClick={() => onAddItemClick()} aria-label="add new item">
                  <BackupIcon />
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="filter list">
              <IconButton aria-label="filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip> */}
            </>
          )}
        </div>
      </Toolbar>

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
                  {column.sortable ? (
                    <TableSortLabel
                      active={column.sortable && sortingColumn && sortingColumn === column.key}
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
                  controls
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody className={classes.tableBody}>
            {paginatedList.map((item, index) => (
              <DataRegistryRow
                key={item.id ?? index}
                item={item}
                columns={visibleColumns}
                isSelected={selectedItems.includes(item.id)}
                onSelectionChange={() => handleSelectClick(item.id)}
                onEditItemClick={onEditItemClick}
                contentPreview={getItemContentPreview ? getItemContentPreview(item.id) : null}
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
        rowsPerPageOptions={[5, 10, 25, { label: 'all', value: numFilteredItems }]}
        onChangePage={handlePageNumberChange}
        onChangeRowsPerPage={handleNumRowsPerPageChange}
      />
    </Paper>
  )
}
