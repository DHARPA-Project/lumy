import React from 'react'
import { Table } from 'apache-arrow'

import Container from '@material-ui/core/Container'

import {
  DataRepositoryItemsTable,
  DataRepositoryItemStructure,
  MockProcessorResult,
  ModuleProps,
  useStepInputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { IRequiredDataSetProp, TabularDataMappingForm } from '@dharpa-vre/data-mapping-table'

import { MappingTableStructure, toObject, fromObject } from './mappingTable'

type CorpusStructure = DataRepositoryItemStructure

export type CorpusTableType = Table<CorpusStructure>
type MappingTable = Table<MappingTableStructure>

interface InputValues {
  corpus: CorpusTableType
  nodesMappingTable: MappingTable
  edgesMappingTable: MappingTable
}

const dataMappingTableCaption =
  'Map data sources to data sets required for this workflow. The first column lists the names of the (re)sources from which you can extract data. The headings of the other columns are the names of the data sets required for this workflow. The labels of the selection fields are the names of the required data fields. The options on the drop-down list correspond to columns found in your data (re)source.'

const nodeFields = ['id', 'label', 'group']
const edgeFields = ['source', 'target', 'weight']

const networkAnalysisDataSets: IRequiredDataSetProp[] = [
  {
    name: 'nodes',
    requiredFields: nodeFields
  },
  {
    name: 'edges',
    requiredFields: edgeFields
  }
]

const NetworkAnalysisDataMapping = ({ pageDetails: { id: stepId } }: ModuleProps): JSX.Element => {
  const [corpusPage] = useStepInputValue<CorpusTableType>(stepId, 'corpus', { fullValue: true })
  const [nodeMappingTable, setNodeMappingTable] = useStepInputValue<MappingTable>(
    stepId,
    'nodesMappingTable',
    { fullValue: true }
  )
  const [edgeMappingTable, setEdgeMappingTable] = useStepInputValue<MappingTable>(
    stepId,
    'edgesMappingTable',
    { fullValue: true }
  )

  const isDataSetMappedInDataSource = (dataSourceId: string, dataSetName: string): boolean => {
    const mappingTable =
      dataSetName === 'nodes' ? nodeMappingTable : dataSetName === 'edges' ? edgeMappingTable : null

    const tableObject = mappingTable == null ? {} : toObject(mappingTable)

    return Object.entries(tableObject).some(([, mappingList]) =>
      (mappingList ?? []).some(mapping => mapping.id === dataSourceId)
    )
  }

  const getColumnMappedToField = (dataSourceId: string, fieldName: string): string => {
    const fieldMap =
      ((toObject(nodeMappingTable) ?? {})?.[fieldName] ?? []).find(
        fieldToSourceMap => String(fieldToSourceMap?.id) === dataSourceId
      ) ||
      ((toObject(edgeMappingTable) ?? {})?.[fieldName] ?? []).find(
        fieldToSourceMap => String(fieldToSourceMap?.id) === dataSourceId
      )

    return fieldMap?.column
  }

  const clearMappingsForDataSet = (dataSourceId: string, dataSetName: string): void => {
    let mappingTable: MappingTable
    let setMappingTable: (table: MappingTable) => void

    if (dataSetName === 'nodes') {
      mappingTable = nodeMappingTable
      setMappingTable = setNodeMappingTable
    } else if (dataSetName === 'edges') {
      mappingTable = edgeMappingTable
      setMappingTable = setEdgeMappingTable
    }

    if (!setMappingTable) return

    const tableObject = mappingTable == null ? {} : toObject(mappingTable)

    Object.entries(tableObject).forEach(([fieldName, mappingList]) => {
      tableObject[fieldName] = mappingList.filter(mapping => mapping.id !== dataSourceId)
    })

    setMappingTable(fromObject(tableObject))
  }

  const setColumnMappedToField = (dataSourceId: string, fieldName: string, columnName: string): void => {
    let fields: string[] = []
    let mappingTable: MappingTable
    let setMappingTable: (table: MappingTable) => void

    if (nodeFields.includes(fieldName)) {
      fields = nodeFields
      mappingTable = nodeMappingTable
      setMappingTable = setNodeMappingTable
    } else if (edgeFields.includes(fieldName)) {
      fields = edgeFields
      mappingTable = edgeMappingTable
      setMappingTable = setEdgeMappingTable
    }

    if (!setMappingTable) return

    const tableObject = mappingTable == null ? {} : toObject(mappingTable)
    if (tableObject[fieldName] == null) tableObject[fieldName] = []

    // if a relevant mapping already exists, update it
    if (tableObject[fieldName].some(entry => entry.id === dataSourceId)) {
      tableObject[fieldName] = (tableObject[fieldName] ?? []).map(mapping =>
        mapping.id === dataSourceId
          ? {
              id: dataSourceId,
              column: columnName
            }
          : mapping
      )
    } else {
      // otherwise, create mappings for all the required fields in the current data set
      fields.forEach(
        field =>
          (tableObject[field] = [
            ...(tableObject[field] ?? []),
            { id: dataSourceId, column: field === fieldName ? columnName : '' }
          ])
      )
    }

    setMappingTable(fromObject(tableObject))
  }

  return (
    <Container maxWidth="lg">
      <TabularDataMappingForm
        corpusPage={corpusPage}
        requiredDataSets={networkAnalysisDataSets}
        isDataSetMappedInDataSource={isDataSetMappedInDataSource}
        getColumnMappedToField={getColumnMappedToField}
        clearMappingsForDataSet={clearMappingsForDataSet}
        setColumnMappedToField={setColumnMappedToField}
        tableCaption={dataMappingTableCaption}
      />
    </Container>
  )
}

const mockProcessor = (
  { corpus }: InputValues,
  dataRepositoryTable?: DataRepositoryItemsTable
): MockProcessorResult<InputValues, unknown> => {
  const defaultCorpus = dataRepositoryTable?.slice(0, 2)
  return { inputs: { corpus: corpus ?? defaultCorpus } }
}

export default withMockProcessor(NetworkAnalysisDataMapping, mockProcessor)
