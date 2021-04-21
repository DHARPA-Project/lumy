import React from 'react'
import {
  ModuleProps,
  useStepInputValue,
  useStepInputValueView,
  ViewFilter,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { List, Table, Utf8 } from 'apache-arrow'
import { TableView } from '../components/TableView'

/**
 * columns in the `corpus` table.
 */
type CorpusStructure = {
  // URI of the corpus item.
  uri: Utf8
  // Human readable label of the item.
  label: Utf8
  // If the corpus item is a tabular file - columns in the file.
  columns?: List<Utf8>
}
type CorpusColumns = keyof CorpusStructure

interface InputValues {
  repositoryItems?: Table<CorpusStructure>
  selectedItemsUris?: string[]
  metadataFields?: CorpusColumns[]
}

interface OutputValues {
  selectedItems?: Table<Partial<CorpusStructure>>
}

type Props = ModuleProps<InputValues, OutputValues>

const DataSelection = ({ step }: Props): JSX.Element => {
  const [repositoryItemsFilter, setRepositoryItemsFilter] = React.useState<ViewFilter>({ pageSize: 5 })
  const [selectedItemsUris = [], setSelectedItemsUris] = useStepInputValue<string[]>(
    step.stepId,
    'selectedItemsUris'
  )
  const [metadataFields = [], setMetadataFields] = useStepInputValue<string[]>(step.stepId, 'metadataFields')
  const [repositoryItemsBatch, tableStats] = useStepInputValueView(
    step.stepId,
    'repositoryItems',
    repositoryItemsFilter,
    'repositoryItemsTableView'
  )

  const handleMetadataFieldSelection = (field: string, isSelected: boolean) => {
    if (isSelected) setMetadataFields(metadataFields.concat(field))
    else setMetadataFields(metadataFields.filter(f => f !== field))
  }

  return (
    <div key={step.stepId}>
      <h3>Choose items for the corpus:</h3>
      {repositoryItemsBatch == null || tableStats == null ? (
        ''
      ) : (
        <TableView
          table={repositoryItemsBatch}
          tableStats={tableStats}
          selections={selectedItemsUris}
          onSelectionsChanged={setSelectedItemsUris}
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

const mockProcessor = ({
  repositoryItems,
  selectedItemsUris = [],
  metadataFields
}: InputValues): OutputValues => {
  if (repositoryItems == null) return
  /**
   * Because arrow was built to be zero copy,
   * converting tables to table while filtering by rows
   * is not easy. It can be done with a predicate, but there
   * is no way to get a new table after filtering. It's ok
   * for now because it is unlikely be needed on the frontend.
   * If it will, we may need to move the code below into a utility
   * file.
   */
  const selectedItemsRowsIndices = selectedItemsUris
    .map(uri => repositoryItems.getColumn('uri').indexOf(uri))
    .filter(i => i >= 0)

  if (selectedItemsRowsIndices.length === 0) {
    return {
      selectedItems: Table.empty(repositoryItems.schema).select('uri', ...(metadataFields ?? []))
    }
  }
  const selectedItems = selectedItemsRowsIndices
    .reduce(
      (acc, i) =>
        acc == null ? repositoryItems.slice(i, i + 1) : acc.concat(repositoryItems.slice(i, i + 1)),
      undefined as typeof repositoryItems
    )
    .select('uri', ...(metadataFields ?? []))

  return {
    selectedItems
  }
}

export default withMockProcessor(DataSelection, mockProcessor)
