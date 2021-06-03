import React from 'react'
import { Table } from 'apache-arrow'

import Typography from '@material-ui/core/Typography'

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

import useStyles from './DataSelection.styles'

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
  const classes = useStyles()

  const [repositoryItemsFilter, setRepositoryItemsFilter] = React.useState<DataRepositoryItemsFilter>({
    pageSize: 5,
    types: ['table']
  })
  const [selectedItemsIds = [], setSelectedItemsIds] = useStepInputValue<string[]>(
    step.stepId,
    'selectedItemsIds'
  )
  const [repositoryItemsBatch, repositoryStats] = useDataRepository(repositoryItemsFilter)

  const updateRepositoryItemsFilter = (filter: DataRepositoryItemsFilter) =>
    setRepositoryItemsFilter({ pageSize: 5, ...filter, types: ['table'] })

  return (
    <div key={step.stepId}>
      <section className={classes.section}>
        <Typography className={classes.sectionHeading} variant="subtitle1" gutterBottom>
          Select the repository items that contain data about the nodes and edges
        </Typography>
        {repositoryItemsBatch != null && repositoryStats != null && (
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
        )}
      </section>
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
