/**
 * Converters between MUI data-grid interfaces and similar interfaces
 * in Lumy.
 */
import { Table, Field } from 'apache-arrow'
import {
  GridColDef,
  GridRowData,
  GridFilterModelState,
  GridSortModel,
  GridSortDirection,
  GridFilterItem,
  GridLinkOperator
} from '@material-ui/data-grid'
import {
  DataFilterCondtion,
  DataSortingMethod,
  DataSortingDirection,
  DataFilterItem,
  DataFilterCondtionOperator
} from '@dharpa-vre/client-core'
import { getFilterOperators } from '../filterOperators'
import { getCellRenderer } from '../cellRenderers'
import { getHeaderRenderer } from '../headerRenderer'

/**
 * We do not use filtering mechanism provided by `data-grid` but we still want the grid
 * to display an icon in the header of a column when there is a filter applied to it.
 * Internally, `data-grid` uses GridFilterModelState to figure out if a column has
 * a filter applied. So we provide some fake filters here.
 */
export const toGridFilterModelState = (condition: DataFilterCondtion | undefined): GridFilterModelState => ({
  items:
    condition?.items?.map(item => ({
      columnField: item.column,
      operatorValue: 'equals',
      value: 'placeholder'
    })) ?? []
})

export const toSortDirection = (direction: DataSortingDirection): GridSortDirection => {
  switch (direction) {
    case 'asc':
      return 'asc'
    case 'desc':
      return 'desc'
    default:
      return undefined
  }
}
export const fromGridSortDirection = (direction: GridSortDirection): DataSortingDirection => {
  switch (direction) {
    case 'asc':
      return DataSortingDirection.Asc
    case 'desc':
      return DataSortingDirection.Desc
    default:
      return DataSortingDirection.Default
  }
}

export const toGridSortModel = (sortingMethod: DataSortingMethod | undefined): GridSortModel => {
  if (sortingMethod == null) return undefined
  return [
    {
      field: sortingMethod.column,
      sort: toSortDirection(sortingMethod.direction)
    }
  ]
}

export const toDataSortingMethod = (sortModel: GridSortModel): DataSortingMethod | undefined => {
  if (sortModel == null || sortModel?.length === 0) return undefined
  const firstItem = sortModel[0]
  return {
    column: firstItem.field,
    direction: fromGridSortDirection(firstItem.sort)
  }
}

export const asGridFilterItem = (item: DataFilterItem, index: number): GridFilterItem => ({
  id: index,
  columnField: item.column,
  value: item.value == null ? '' : String(item.value),
  operatorValue: item.operator
})

export const asDataFilterItem = (item: GridFilterItem): DataFilterItem => {
  return {
    column: item.columnField,
    operator: item.operatorValue,
    value: item.value == '' ? undefined : item.value
  }
}

export const asGridLinkOperator = (operator: DataFilterItem['operator'] | undefined): GridLinkOperator => {
  switch (operator) {
    case 'or':
      return GridLinkOperator.Or
    default:
      return GridLinkOperator.And
  }
}

export const asDataFilterCondtionOperator = (operator: GridLinkOperator): DataFilterCondtionOperator => {
  switch (operator) {
    case GridLinkOperator.Or:
      return DataFilterCondtionOperator.Or
    default:
      return DataFilterCondtionOperator.And
  }
}

interface ColDefOptions {
  sortingEnabled: boolean
  filteringEnabled: boolean
}

export function toColDef(field: Field, options: ColDefOptions): GridColDef {
  const filterOperators = getFilterOperators(field.type)
  return {
    field: field.name,
    headerName: field.metadata.get('title') ?? field.name,
    description: field.metadata.get('description'),
    flex: 1,
    sortable: options?.sortingEnabled,
    filterable: options?.filteringEnabled && filterOperators.length > 0,
    editable: false, // we do not support editing (yet)
    renderCell: getCellRenderer(field.type),
    renderHeader: getHeaderRenderer(field.type),
    filterOperators
  }
}

export function toRow(row: ReturnType<Table['get']>, columns: string[], index: number): GridRowData {
  const data = columns.reduce(
    (acc, column) => ({ ...acc, [column]: row.get(column) }),
    {} as { [key: string]: unknown }
  )
  // Row must have and 'id' field: https://material-ui.com/components/data-grid/rows/
  if (!columns.includes('id')) data['id'] = index
  return data
}
