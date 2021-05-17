import React from 'react'

import {
  DataRepositoryItemStructure,
  ModuleProps,
  useStepInputValue,
  withMockProcessor
} from '@dharpa-vre/client-core'
import { Table, Utf8Vector, Int32Vector } from 'apache-arrow'
import { MappingTableStructure, toObject, fromObject } from './mappingTable'
import { EdgesStructure, NodesStructure } from '../networkAnalysisDataVis/structure'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'

type CorpusStructure = DataRepositoryItemStructure

type CorpusTable = Table<CorpusStructure>
type MappingTable = Table<MappingTableStructure>

type NodesTable = Table<NodesStructure>
type EdgesTable = Table<EdgesStructure>

interface InputValues {
  corpus: CorpusTable
  nodesMappingTable: MappingTable
  edgesMappingTable: MappingTable
}

interface OutputValues {
  nodes: NodesTable
  edges: EdgesTable
}

const DefaultPreviewPageSize = 5

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataMapping = ({ step }: Props): JSX.Element => {
  const [corpusPage] = useStepInputValue<CorpusTable>(step.stepId, 'corpus', {
    pageSize: DefaultPreviewPageSize
  })
  const [nodesMappingTable, setNodesMappingTable] = useStepInputValue<MappingTable>(
    step.stepId,
    'nodesMappingTable',
    { fullValue: true }
  )
  const [edgesMappingTable, setEdgesMappingTable] = useStepInputValue<MappingTable>(
    step.stepId,
    'edgesMappingTable',
    { fullValue: true }
  )

  const isUsedInMappingTable = (table: MappingTable, fields: string[]) => (id: string): boolean => {
    if (table == null) return false
    return (
      fields
        .map(field => (toObject(table)[field] ?? []).find(i => i.id.toString() === id) != null)
        .filter(v => v === true).length > 0
    )
  }

  const setUsedInMappingTable = (table: MappingTable, update: (t: MappingTable) => void) => (
    id: string,
    mapping: { [key: string]: string },
    doUse: boolean
  ): void => {
    const s = table == null ? {} : toObject(table)
    if (doUse) {
      Object.entries(mapping).forEach(([field, column]) => {
        s[field] = (s[field] ?? []).concat([{ id, column }])
      })
    } else {
      Object.entries(mapping).forEach(([field]) => {
        s[field] = (s[field] ?? []).filter(i => i.id !== id)
      })
    }
    update(fromObject(s))
  }

  return (
    <div style={{ border: '1px dashed #777' }}>
      <div>
        <em>corpus items:</em>
        <ul>
          {[...(corpusPage ?? [])].map((row, idx) => {
            return (
              <li key={idx}>
                <dl style={{ display: 'flex', flexDirection: 'row' }}>
                  <dd>{row.id}</dd>
                  <dd>{[...(row.columnNames ?? [])].join(', ')}</dd>
                  <dd>
                    <span>use for nodes (first two columns)</span>
                    <input
                      type="checkbox"
                      checked={isUsedInMappingTable(nodesMappingTable, ['id', 'label'])(row.id)}
                      onChange={e =>
                        setUsedInMappingTable(nodesMappingTable, setNodesMappingTable)(
                          row.id,
                          {
                            id: row.columnNames?.get(0),
                            label: row.columnNames?.get(1)
                          },
                          e.target.checked
                        )
                      }
                    />
                  </dd>
                  <dd>
                    <span>use for edges (first three columns)</span>
                    <input
                      type="checkbox"
                      checked={isUsedInMappingTable(edgesMappingTable, ['srcId', 'tgtId', 'weight'])(row.id)}
                      onChange={e =>
                        setUsedInMappingTable(edgesMappingTable, setEdgesMappingTable)(
                          row.id,
                          {
                            srcId: row.columnNames?.get(0),
                            tgtId: row.columnNames?.get(1),
                            weight: row.columnNames?.get(2)
                          },
                          e.target.checked
                        )
                      }
                    />
                  </dd>
                </dl>
              </li>
            )
          })}
        </ul>
      </div>
      <DataGrid data={edgesMappingTable} />
    </div>
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
