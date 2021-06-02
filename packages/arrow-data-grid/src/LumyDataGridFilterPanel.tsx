import React from 'react'
import Button from '@material-ui/core/Button'
import {
  GridPanelWrapper,
  GridPanelContent,
  GridFilterForm,
  GridPanelFooter,
  GridFilterItem,
  GridAddIcon,
  GridLinkOperator,
  GridApiContext,
  useGridState
} from '@material-ui/data-grid'
import { DataFilterCondtion, DataFilterItem, DataFilterCondtionOperator } from '@dharpa-vre/client-core'

const asGridFilterItem = (item: DataFilterItem, index: number): GridFilterItem => ({
  id: index,
  columnField: item.column,
  value: item.value == null ? '' : String(item.value),
  operatorValue: item.operator
})

const asDataFilterItem = (item: GridFilterItem): DataFilterItem => {
  return {
    column: item.columnField,
    operator: item.operatorValue,
    value: item.value == '' ? undefined : item.value
  }
}

const asGridLinkOperator = (operator: DataFilterItem['operator']): GridLinkOperator => {
  switch (operator) {
    case 'or':
      return GridLinkOperator.Or
    default:
      return GridLinkOperator.And
  }
}

const asDataFilterCondtionOperator = (operator: GridLinkOperator): DataFilterCondtionOperator => {
  switch (operator) {
    case GridLinkOperator.Or:
      return DataFilterCondtionOperator.Or
    default:
      return DataFilterCondtionOperator.And
  }
}

export interface FilterPanelProps {
  condition: DataFilterCondtion
  onConditionUpdated?: (condition: DataFilterCondtion) => void
}

export const LumyDataGridFilterPanel = ({ condition, onConditionUpdated }: FilterPanelProps): JSX.Element => {
  const apiRef = React.useContext(GridApiContext)
  apiRef.current.state.options.disableMultipleColumnsFiltering = false

  const [gridState] = useGridState(apiRef)
  const { columns } = gridState

  const handleApplyFilterChanges = (item: GridFilterItem) => {
    const updatedCondition = {
      ...condition,
      items: [...condition.items]
    }
    updatedCondition.items[item.id] = asDataFilterItem(item)
    onConditionUpdated?.(updatedCondition)
  }
  const handleDeleteFilter = (item: GridFilterItem) => {
    const updatedCondition = {
      ...condition,
      items: [...condition.items]
    }
    updatedCondition.items.splice(item.id, 1)
    onConditionUpdated?.(updatedCondition)
  }
  const handleOperatorChanged = (operator: GridLinkOperator) => {
    const updatedCondition = {
      ...condition,
      operator: asDataFilterCondtionOperator(operator)
    }
    onConditionUpdated?.(updatedCondition)
  }
  const handleAddNewFilter = () => {
    const updatedCondition = {
      ...condition,
      items: condition.items.concat({
        column: columns.all[0],
        operator: 'equals',
        value: undefined
      })
    }
    onConditionUpdated?.(updatedCondition)
  }

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {condition.items.map((item, index) => (
          <GridFilterForm
            key={index}
            item={asGridFilterItem(item, index)}
            applyFilterChanges={handleApplyFilterChanges}
            deleteFilter={handleDeleteFilter}
            hasMultipleFilters={condition.items.length > 1}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={asGridLinkOperator(condition.operator)}
            disableMultiFilterOperator={index !== 1}
            applyMultiFilterOperatorChanges={handleOperatorChanged}
          />
        ))}
      </GridPanelContent>
      <GridPanelFooter>
        <Button onClick={handleAddNewFilter} startIcon={<GridAddIcon />} color="primary">
          Add filter
        </Button>
      </GridPanelFooter>
    </GridPanelWrapper>
  )
}

/**
 * Enable multiple columns filter icon.
 */
export const FilterEnabler = (): JSX.Element => {
  const apiRef = React.useContext(GridApiContext)
  apiRef.current.state.options.disableMultipleColumnsFiltering = false
  return <></>
}
