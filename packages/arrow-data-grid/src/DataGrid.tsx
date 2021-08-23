import React from 'react'
import { Table } from 'apache-arrow'
import {
  DataGrid as MuiDataGrid,
  GridColumns,
  GridRowsProp,
  GridFooter,
  GridSortModelParams
} from '@material-ui/data-grid'
import { TableStats, TabularDataFilter, DataFilterCondition } from '@dharpa-vre/client-core'
import { useStyles, useHeights } from './DataGrid.styles'
import { LumyDataGridFilterPanel, MultiFilterIconEnabler } from './LumyDataGridFilterPanel'
import {
  toGridFilterModelState,
  toGridSortModel,
  toDataSortingMethod,
  toColDef,
  toRow
} from './util/converters'

const DefaultPageSize = 10

export interface DataGridProps {
  data: Table
  stats: TableStats
  /* 
    If client mode is made available, `stats` can be made optional
    because we will have all data available in `data`.
  */
  // stats?: TableStats
  filter?: TabularDataFilter
  onFiltering?: (filter: TabularDataFilter) => void
  condensed?: boolean
  sortingEnabled?: boolean
  filteringEnabled?: boolean
}

export const DataGrid = ({
  data,
  stats,
  onFiltering,
  filter,
  condensed = false,
  sortingEnabled = false,
  filteringEnabled = false
}: DataGridProps): JSX.Element => {
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(filter?.pageSize ?? DefaultPageSize)
  const [isLoading, setIsLoading] = React.useState(false)
  const classes = useStyles()
  const heights = useHeights({ rowCondensed: condensed })

  /**
   * When the grid is in "server" mode it means that the "data" property
   * includes only a part (page) of the whole data. In this mode when pagination,
   * filtering or sorting is requested by the user interacting with the grid,
   * the "onFiltering" property is called to instruct the backend to get more data.
   *
   * Not to confuse with "server/client" modes of MUI "data-grid". We are managing our
   * data ourselves instead of letting "data-grid" do it. Even in "client" mode.
   *
   * NOTE: Disabled "client" mode for now to avoid duplicating filter code. We may want to
   * enable it later.
   */
  // const gridIsInServerMode = data?.length < stats?.rowsCount && stats?.rowsCount != null

  React.useEffect(() => {
    // if (!gridIsInServerMode) return

    if (filter == null) {
      console.warn(
        'The grid "data" property contains a subset of the whole data, but the "filter" property is not provided.'
      )
    }

    const pageOffset = currentPage * pageSize
    const newFilter: TabularDataFilter = { ...filter, offset: pageOffset }

    if (onFiltering == null) {
      console.warn(
        'The grid "data" property contains a subset of the whole data, but the "onFiltering" property is not provided.'
      )
    }

    onFiltering?.(newFilter)
  }, [currentPage, pageSize])

  React.useEffect(() => {
    // if (gridIsInServerMode) {
    //   const pageOffset = currentPage * pageSize
    //   setIsLoading(pageOffset >= stats?.rowsCount || (data?.length ?? 0) === 0)
    // } else {
    setIsLoading(data == null)
    // }
  }, [data, currentPage, pageSize])

  React.useEffect(() => {
    if (filter?.offset == null) return
    const newCurrentPage = Math.floor(filter?.offset / pageSize)
    setCurrentPage(newCurrentPage)
  }, [filter?.offset])

  React.useEffect(() => {
    if (filter?.pageSize == null) return
    setPageSize(filter?.pageSize)
  }, [filter?.pageSize])

  const handleSortModelChange = (params: GridSortModelParams) => {
    const updatedFilter: TabularDataFilter = {
      ...filter,
      sorting: toDataSortingMethod(params.sortModel)
    }
    onFiltering?.(updatedFilter)
  }

  const handleFilterConditionUpdated = (condition: DataFilterCondition) => {
    const updatedFilter: TabularDataFilter = {
      ...filter,
      condition
    }
    onFiltering?.(updatedFilter)
  }

  if (data == null) return <></>

  const condition = filter?.condition

  return (
    <MuiDataGrid
      className={classes.root}
      columns={getColumns(data, sortingEnabled, filteringEnabled)}
      // rows={getRows(data, gridIsInServerMode ? 0 : currentPage, pageSize)}
      rows={getRows(data, 0, pageSize)}
      pageSize={pageSize}
      page={currentPage}
      onPageChange={p => setCurrentPage(p.page)}
      paginationMode="server"
      autoHeight
      // rowCount={gridIsInServerMode ? stats?.rowsCount : data?.length}
      rowCount={stats?.rowsCount}
      sortingMode="server"
      filterMode="server"
      loading={isLoading}
      disableColumnSelector
      disableSelectionOnClick
      rowHeight={heights.row}
      headerHeight={heights.header}
      components={{
        // eslint-disable-next-line react/display-name
        FilterPanel: () => (
          <LumyDataGridFilterPanel condition={condition} onConditionUpdated={handleFilterConditionUpdated} />
        ),
        // eslint-disable-next-line react/display-name
        Footer: () => (
          <>
            <MultiFilterIconEnabler />
            <GridFooter />
          </>
        )
      }}
      filterModel={toGridFilterModelState(filter?.condition)}
      sortModel={toGridSortModel(filter?.sorting)}
      onSortModelChange={handleSortModelChange}
    ></MuiDataGrid>
  )
}

function getColumns(data: Table, sortingEnabled: boolean, filteringEnabled: boolean): GridColumns {
  return data?.schema?.fields?.map(field => toColDef(field, { sortingEnabled, filteringEnabled })) ?? []
}

function getRows(data: Table, page: number, pageSize: number): GridRowsProp {
  const offset = page * pageSize
  const rows: GridRowsProp = []
  const slice = data.slice(offset, offset + pageSize)
  const columns = data.schema.fields.map(f => f.name)

  let idx = offset
  for (const row of slice) {
    rows.push(toRow(row, columns, idx++))
  }

  return rows
}
