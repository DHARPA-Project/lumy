import React from 'react'

import { ModuleProps, useStepInputValueView } from '@dharpa-vre/client-core'
import { Table, List, Utf8 } from 'apache-arrow'

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

interface InputValues {
  corpus: Table<CorpusStructure>
  nodesMappingTable: Table
  edgesMappingTable: Table
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

  // const [nodesMappingTableStats, setNodesMappingTable] = useStepInputValue<TableStats>(
  //   step.id,
  //   'nodesMappingTable'
  // )
  // const [nodesMappingTable] = useStepInputValueView(
  //   step.id,
  //   'nodesMappingTable',
  //   { pageSize: nodesMappingTableStats?.rowsCount ?? 0 },
  //   'nodesMappingTableMainView'
  // )

  // const [edgesMappingTableStats, setEdgesMappingTable] = useStepInputValue<TableStats>(
  //   step.id,
  //   'edgesMappingTable'
  // )
  // const [edgesMappingTable] = useStepInputValueView(
  //   step.id,
  //   'edgesMappingTable',
  //   { pageSize: edgesMappingTableStats?.rowsCount ?? 0 },
  //   'edgesMappingTableMainView'
  // )

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
                {row.uri}: {[...(row.columns ?? [])].join(', ')}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default NetworkAnalysisDataMapping
