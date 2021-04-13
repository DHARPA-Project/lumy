import React from 'react'

import { ModuleProps, TableStats, useStepInputValue, useStepInputValueView } from '@dharpa-vre/client-core'
import { Table, List, Utf8 } from 'apache-arrow'
import { MappingTableStructure, toObject, fromObject } from './mappingTable'

type CorpusStructure = {
  uri: Utf8
  label: Utf8
  columns?: List<Utf8>
}

type CorpusTable = Table<CorpusStructure>
type MappingTable = Table<MappingTableStructure>

interface InputValues {
  corpus: CorpusTable
  nodesMappingTable: MappingTable
  edgesMappingTable: MappingTable
}

interface OutputValues {
  nodes: Table
  edges: Table
}

const DefaultPreviewPageSize = 5

type Props = ModuleProps<InputValues, OutputValues>

const NetworkAnalysisDataMapping = ({ step }: Props): JSX.Element => {
  const [corpusPage] = useStepInputValueView<CorpusStructure>(
    step.id,
    'corpus',
    { pageSize: DefaultPreviewPageSize },
    'corpusPageView'
  )

  const [nodesMappingTableStats, setNodesMappingTable] = useStepInputValue<TableStats, MappingTable>(
    step.id,
    'nodesMappingTable'
  )
  const [nodesMappingTable] = useStepInputValueView<MappingTableStructure>(
    step.id,
    'nodesMappingTable',
    { pageSize: nodesMappingTableStats?.rowsCount ?? 0 },
    'nodesMappingTableMainView'
  )

  const [edgesMappingTableStats, setEdgesMappingTable] = useStepInputValue<TableStats, MappingTable>(
    step.id,
    'edgesMappingTable'
  )
  const [edgesMappingTable] = useStepInputValueView<MappingTableStructure>(
    step.id,
    'edgesMappingTable',
    { pageSize: edgesMappingTableStats?.rowsCount ?? 0 },
    'edgesMappingTableMainView'
  )

  const isUsedInMappingTable = (table: MappingTable, fields: string[]) => (uri: string): boolean => {
    if (table == null) return false
    return (
      fields
        .map(field => (toObject(table)[field] ?? []).find(i => i.uri.toString() === uri) != null)
        .filter(v => v === true).length > 0
    )
  }

  const setUsedInMappingTable = (
    table: MappingTable,
    update: (t: MappingTable) => void,
    mapping: { [key: string]: string }
  ) => (uri: string, doUse: boolean): void => {
    const s = table == null ? {} : toObject(table)
    if (doUse) {
      Object.entries(mapping).forEach(([field, column]) => {
        const array = s[field] ?? []
        array.push({ uri, column })
        s[field] = array
      })
    } else {
      Object.entries(mapping).forEach(([field, column]) => {
        s[field] = (s[field] ?? []).filter(i => !(i.uri === uri && i.column === column))
      })
    }
    update(fromObject(s))
  }

  // const [nodesPage] = useStepOutputValueView(
  //   step.id,
  //   'nodes',
  //   { pageSize: DefaultPreviewPageSize },
  //   'nodesPreview'
  // )

  // const [edgesPage] = useStepOutputValueView(
  //   step.id,
  //   'edges',
  //   { pageSize: DefaultPreviewPageSize },
  //   'edgesPreview'
  // )

  return (
    <div style={{ border: '1px dashed #777' }}>
      <div>
        <em>corpus items:</em>
        <ul>
          {[...(corpusPage ?? [])].map((row, idx) => {
            return (
              <li key={idx}>
                <dl style={{ display: 'flex', flexDirection: 'row' }}>
                  <dd>{row.uri}</dd>
                  <dd>{[...(row.columns ?? [])].join(', ')}</dd>
                  <dd>
                    <span>use for nodes (first two columns)</span>
                    <input
                      type="checkbox"
                      checked={isUsedInMappingTable(nodesMappingTable, ['id', 'label'])(row.uri)}
                      onChange={e =>
                        setUsedInMappingTable(nodesMappingTable, setNodesMappingTable, {
                          id: 'a',
                          label: 'b'
                        })(row.uri, e.target.checked)
                      }
                    />
                  </dd>
                  <dd>
                    <span>use for edges (first three columns)</span>
                    <input
                      type="checkbox"
                      checked={isUsedInMappingTable(edgesMappingTable, ['srcId', 'tgtId', 'weight'])(row.uri)}
                      onChange={e =>
                        setUsedInMappingTable(edgesMappingTable, setEdgesMappingTable, {
                          srcId: 'a',
                          tgtId: 'b',
                          weight: 'c'
                        })(row.uri, e.target.checked)
                      }
                    />
                  </dd>
                </dl>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default NetworkAnalysisDataMapping
