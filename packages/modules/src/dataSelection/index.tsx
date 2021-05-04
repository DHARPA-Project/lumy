import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  withMockProcessor,
  DataRepositoryItemsFilter,
  useDataRepository,
  DataRepositoryItemStructure,
  DataRepositoryItemsTable
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
    pageSize: 5
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
          onFilterChanged={setRepositoryItemsFilter}
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
            .filter(f => f.name !== 'uri')
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
  /**
   * Because arrow was built to be zero copy,
   * converting tables to table while filtering by rows
   * is not easy. It can be done with a predicate, but there
   * is no way to get a new table after filtering. It's ok
   * for now because it is unlikely be needed on the frontend.
   * If it will, we may need to move the code below into a utility
   * file.
   */
  const selectedItemsRowsIndices = selectedItemsIds
    .map(id => dataRepositoryTable.getColumn('id').indexOf(id))
    .filter(i => i >= 0)

  const fields = (metadataFields ?? []) as KnownMetadataFields[]

  if (selectedItemsRowsIndices.length === 0) {
    return {
      selectedItems: Table.empty(dataRepositoryTable.schema).select('id', ...fields)
    }
  }
  const selectedItems = selectedItemsRowsIndices
    .reduce(
      (acc, i) =>
        acc == null ? dataRepositoryTable.slice(i, i + 1) : acc.concat(dataRepositoryTable.slice(i, i + 1)),
      undefined as typeof dataRepositoryTable
    )
    .select('id', ...fields)

  return {
    selectedItems
  }
}

export default withMockProcessor(DataSelection, mockProcessor)
