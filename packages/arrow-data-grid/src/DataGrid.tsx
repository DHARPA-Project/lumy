import React from 'react'
import { Table, Field } from 'apache-arrow'
import {
  DataGrid as MuiDataGrid,
  GridColumns,
  GridRowsProp,
  GridColDef,
  GridRowData
} from '@material-ui/data-grid'
import { TableStats, TabularDataFilter } from '@dharpa-vre/client-core'
import { getCellRenderer } from './cellRenderers'
import { getHeaderRenderer } from './headerRenderer'
import { useStyles, useHeights } from './DataGrid.styles'

const DefaultPageSize = 10

export interface DataGridProps {
  data: Table
  stats?: TableStats
  filter?: TabularDataFilter
  onFiltering?: (filter: TabularDataFilter) => void
  condensed?: boolean
}

export const DataGrid = ({
  data,
  stats,
  onFiltering,
  filter,
  condensed = false
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
   */
  const gridIsInServerMode = data?.length < stats?.rowsCount && stats?.rowsCount != null

  React.useEffect(() => {
    if (!gridIsInServerMode) return

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
  }, [currentPage])

  React.useEffect(() => {
    if (gridIsInServerMode) {
      const pageOffset = currentPage * pageSize
      setIsLoading(pageOffset >= stats?.rowsCount || (data?.length ?? 0) === 0)
    } else {
      setIsLoading(data == null)
    }
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

  if (data == null) return <></>

  return (
    <MuiDataGrid
      className={classes.root}
      columns={getColumns(data)}
      rows={getRows(data, gridIsInServerMode ? 0 : currentPage, pageSize)}
      pageSize={pageSize}
      page={currentPage}
      onPageChange={p => setCurrentPage(p.page)}
      paginationMode="server"
      autoHeight
      rowCount={gridIsInServerMode ? stats?.rowsCount : data?.length}
      sortingMode="server"
      loading={isLoading}
      disableColumnSelector
      disableSelectionOnClick
      rowHeight={heights.row}
      headerHeight={heights.header}
    ></MuiDataGrid>
  )
}

function getColumns(data: Table): GridColumns {
  return data?.schema?.fields?.map(toColDef) ?? []
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

function toColDef(field: Field): GridColDef {
  return {
    field: field.name,
    headerName: field.metadata.get('title') ?? field.name,
    description: field.metadata.get('description'),
    flex: 1,
    sortable: false, // we do not support sorting yet
    filterable: false, // we do not support filtering yet
    editable: false, // we do not support editing
    renderCell: getCellRenderer(field.type),
    renderHeader: getHeaderRenderer(field.type)
  }
}
function toRow(row: ReturnType<Table['get']>, columns: string[], index: number): GridRowData {
  const data = columns.reduce(
    (acc, column) => ({ ...acc, [column]: row.get(column) }),
    {} as { [key: string]: unknown }
  )
  // Row must have and 'id' field: https://material-ui.com/components/data-grid/rows/
  if (!columns.includes('id')) data['id'] = index
  return data
}
