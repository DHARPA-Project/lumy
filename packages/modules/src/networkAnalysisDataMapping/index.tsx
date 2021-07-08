import React from 'react'
import { Table, Utf8Vector, Int32Vector } from 'apache-arrow'

import {
  DataRepositoryItemStructure,
  ModuleProps,
  useStepInputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { IRequiredDataSetProp, TabularDataMappingForm } from '@dharpa-vre/data-mapping-table'

import { MappingTableStructure, toObject, fromObject } from './mappingTable'
import { EdgesStructure, NodesStructure } from '../networkAnalysisDataVis/structure'

type CorpusStructure = DataRepositoryItemStructure

export type CorpusTableType = Table<CorpusStructure>
type MappingTable = Table<MappingTableStructure>

type NodeTable = Table<NodesStructure>
type EdgeTable = Table<EdgesStructure>

interface InputValues {
  corpus: CorpusTableType
  nodesMappingTable: MappingTable
  edgesMappingTable: MappingTable
}

interface OutputValues {
  nodes: NodeTable
  edges: EdgeTable
}

const dataMappingTableCaption =
  'Map data sources to data sets required for this workflow. The first column lists the names of the (re)sources from which you can extract data. The headings of the other columns are the names of the data sets required for this workflow. The labels of the selection fields are the names of the required data fields. The options on the drop-down list correspond to columns found in your data (re)source.'

const nodeFields = ['id', 'label', 'group']
const edgeFields = ['srcId', 'tgtId', 'weight']

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
    <TabularDataMappingForm
      corpusPage={corpusPage}
      requiredDataSets={networkAnalysisDataSets}
      isDataSetMappedInDataSource={isDataSetMappedInDataSource}
      getColumnMappedToField={getColumnMappedToField}
      clearMappingsForDataSet={clearMappingsForDataSet}
      setColumnMappedToField={setColumnMappedToField}
      tableCaption={dataMappingTableCaption}
    />
  )
}

const mockProcessor = ({}: InputValues): OutputValues => {
  const numNodes = 123
  const nums = [...new Array(numNodes).keys()]
  const numConnections = numNodes * 2
  const cnums = [...new Array(numConnections).keys()]

  const groups = ['groupA', 'groupB', 'groupC']
  const getRandomGroup = () => {
    const idx = Math.floor(Math.random() * groups.length)
    return groups[idx]
  }

  const getRandomNodeId = () => {
    const idx = Math.floor(Math.random() * numNodes * 0.9)
    return String(nums[idx])
  }

  const maxWeight = 30
  const getRandomWeight = () => Math.floor(Math.random() * maxWeight)

  const nodes = Table.new<NodesStructure>(
    [
      Utf8Vector.from(nums.map(i => String(i))),
      Utf8Vector.from(nums.map(i => `Node ${i}`)),
      Utf8Vector.from(nums.map(() => getRandomGroup()))
    ],
    ['id', 'label', 'group']
  )
  const edges = Table.new<EdgesStructure>(
    [
      Utf8Vector.from(cnums.map(() => getRandomNodeId())),
      Utf8Vector.from(cnums.map(() => getRandomNodeId())),
      Int32Vector.from(cnums.map(() => getRandomWeight()))
    ],
    ['srcId', 'tgtId', 'weight']
  )

  return { nodes, edges }
}

export default withMockProcessor(NetworkAnalysisDataMapping, mockProcessor)
