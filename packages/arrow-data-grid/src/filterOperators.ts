import { GridFilterInputValue, GridFilterItem, GridFilterOperator } from '@material-ui/data-grid'
import { DataType, Utf8 } from 'apache-arrow'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const noopGetApplyFilterFn = (filterItem: GridFilterItem): null => null

function buildStandardFilterOperator(operator: string, label?: string): GridFilterOperator {
  return {
    InputComponent: GridFilterInputValue,
    getApplyFilterFn: noopGetApplyFilterFn,
    value: operator,
    label: label ?? operator
  }
}

const stringOperators = [
  buildStandardFilterOperator('contains', 'Contains'),
  buildStandardFilterOperator('equals', 'Equals')
]

/**
 * We do not use filtering mechanism provided by `data-grid` but we
 * reuse the filter panel components (see LumyDataGridFilterPanel) which
 * require a list of `GridFilterOperator` to be provided for each column
 * that can be filtered.
 * Knowing the type of column from Arrow table we can get a list of simplifed
 * `GridFilterOperator` objects for every type. We only use `value` from this
 * object when we build our filters.
 */
export function getFilterOperators(type: DataType): GridFilterOperator[] {
  if (type instanceof Utf8) {
    return stringOperators
  }
  return []
}
