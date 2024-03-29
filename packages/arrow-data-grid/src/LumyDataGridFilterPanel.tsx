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
import { DataFilterCondition, DataFilterConditionOperator } from '@lumy/client-core'
import {
  asDataFilterItem,
  asDataFilterConditionOperator,
  asGridFilterItem,
  asGridLinkOperator
} from './util/converters'

export interface FilterPanelProps {
  condition?: DataFilterCondition
  onConditionUpdated?: (condition: DataFilterCondition) => void
}

export const LumyDataGridFilterPanel = ({ condition, onConditionUpdated }: FilterPanelProps): JSX.Element => {
  const apiRef = React.useContext(GridApiContext)
  apiRef.current.state.options.disableMultipleColumnsFiltering = false

  const [gridState] = useGridState(apiRef)
  const { columns } = gridState

  const handleApplyFilterChanges = (item: GridFilterItem) => {
    const updatedCondition: DataFilterCondition = {
      operator: condition?.operator ?? DataFilterConditionOperator.And,
      items: [...(condition?.items ?? [])]
    }
    updatedCondition.items[item.id] = asDataFilterItem(item)
    onConditionUpdated?.(updatedCondition)
  }
  const handleDeleteFilter = (item: GridFilterItem) => {
    const updatedCondition: DataFilterCondition = {
      operator: condition?.operator ?? DataFilterConditionOperator.And,
      items: [...(condition?.items ?? [])]
    }
    updatedCondition.items.splice(item.id, 1)
    onConditionUpdated?.(updatedCondition)
  }
  const handleOperatorChanged = (operator: GridLinkOperator) => {
    const updatedCondition: DataFilterCondition = {
      items: condition?.items ?? [],
      operator: asDataFilterConditionOperator(operator)
    }
    onConditionUpdated?.(updatedCondition)
  }

  const firstFilterableColumn = columns.all.find(column => columns.lookup[column].filterable)

  const handleAddNewFilter = () => {
    const updatedCondition: DataFilterCondition = {
      operator: condition?.operator ?? DataFilterConditionOperator.And,
      items: (condition?.items ?? []).concat({
        column: firstFilterableColumn,
        operator: 'equals',
        value: undefined
      })
    }
    onConditionUpdated?.(updatedCondition)
  }

  return (
    <GridPanelWrapper>
      <GridPanelContent>
        {condition?.items?.map((item, index) => (
          <GridFilterForm
            key={index}
            item={asGridFilterItem(item, index)}
            applyFilterChanges={handleApplyFilterChanges}
            deleteFilter={handleDeleteFilter}
            hasMultipleFilters={condition?.items?.length > 1}
            showMultiFilterOperators={index > 0}
            multiFilterOperator={asGridLinkOperator(condition?.operator)}
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
export const MultiFilterIconEnabler = (): JSX.Element => {
  const apiRef = React.useContext(GridApiContext)
  apiRef.current.state.options.disableMultipleColumnsFiltering = false
  return <></>
}
