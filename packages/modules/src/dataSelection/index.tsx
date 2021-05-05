import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  withMockProcessor,
  DataRepositoryItemsFilter,
  useDataRepository,
  DataRepositoryItemStructure,
  DataRepositoryItemsTable,
  arrowUtils
} from '@dharpa-vre/client-core'
import { Table } from 'apache-arrow'
import { TableView } from '../components/TableView'

interface InputValues {
  repositoryItems?: Table<DataRepositoryItemStructure>
  selectedItemsIds?: string[]
  metadataFields?: string[]
}

interface OutputValues {
  selectedItems?: Table<Partial<DataRepositoryItemStructure>>
}

type Props = ModuleProps<InputValues, OutputValues>

const DataSelection = ({ step }: Props): JSX.Element => {
  const [repositoryItemsFilter, setRepositoryItemsFilter] = React.useState<DataRepositoryItemsFilter>({
    pageSize: 5,
    types: ['table']
  })
  const [selectedItemsIds = [], setSelectedItemsIds] = useStepInputValue<string[]>(
    step.stepId,
    'selectedItemsIds'
  )
  const [metadataFields = [], setMetadataFields] = useStepInputValue<string[]>(step.stepId, 'metadataFields')
  const [repositoryItemsBatch, repositoryStats] = useDataRepository(repositoryItemsFilter)

  const handleMetadataFieldSelection = (field: string, isSelected: boolean) => {
    if (isSelected) setMetadataFields(metadataFields.concat(field))
    else setMetadataFields(metadataFields.filter(f => f !== field))
  }

  const updateRepositoryItemsFilter = (filter: DataRepositoryItemsFilter) =>
    setRepositoryItemsFilter({ ...filter, pageSize: 5, types: ['table'] })

  return (
    <div key={step.stepId}>
      <h3>Choose items for the corpus:</h3>
      {repositoryItemsBatch == null || repositoryStats == null ? (
        ''
      ) : (
        <TableView
          table={repositoryItemsBatch}
          tableStats={repositoryStats}
          selections={selectedItemsIds}
          onSelectionsChanged={setSelectedItemsIds}
          filter={repositoryItemsFilter}
          onFilterChanged={updateRepositoryItemsFilter}
          usePagination
          useSelection
        />
      )}{' '}
      <h3>Choose metadata fields for the corpus:</h3>
      {repositoryItemsBatch == null ? (
        ''
      ) : (
        <ul>
          {repositoryItemsBatch.schema.fields
            .filter(f => f.name !== 'id')
            .map((f, idx) => {
              return (
                <li key={idx}>
                  <input
                    type="checkbox"
                    checked={metadataFields.includes(f.name)}
                    onChange={e => handleMetadataFieldSelection(f.name, e.target.checked)}
                  />
                  {f.name}
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

type KnownMetadataFields = keyof DataRepositoryItemStructure

const mockProcessor = (
  { selectedItemsIds = [], metadataFields }: InputValues,
  dataRepositoryTable?: DataRepositoryItemsTable
): OutputValues => {
  if (dataRepositoryTable == null) return

  const fields = new Set(((metadataFields ?? []) as KnownMetadataFields[]).concat(['id']))

  const selectedItems = arrowUtils.filterTable(dataRepositoryTable.select(...fields), row =>
    selectedItemsIds.includes(row.id)
  )
  return {
    selectedItems
  }
}

export default withMockProcessor(DataSelection, mockProcessor)
