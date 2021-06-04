import React, { useContext } from 'react'
import { Table as ArrowTable, Int32, Utf8 } from 'apache-arrow'

import MUIDataTable, { FilterType, MUIDataTableColumnDef } from 'mui-datatables'

import { useStepInputValue } from '@dharpa-vre/client-core'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'

import { WorkflowContext } from '../../context/workflowContext'

const sampleColumns = [
  {
    name: 'name',
    label: 'name',
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: 'field',
    label: 'field',
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: 'city',
    label: 'city',
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: 'university',
    label: 'university',
    options: {
      filter: true,
      sort: false
    }
  }
]

const sampleData = [
  { name: 'Joe James', field: 'network analysis', city: 'Geneva', university: 'GDHU' },
  { name: 'John Walsh', field: 'topic modelling', city: 'Amsterdam', university: 'ADSU' },
  { name: 'Bob Herm', field: 'geolocation', city: 'Luxembourg', university: 'UL' },
  { name: 'James Houston', field: 'network analysis', city: 'Dublin', university: 'DUSS' }
]

const sampleOptions = {
  filterType: 'checkbox' as FilterType
}

export type EdgeStructure = {
  srcId: Utf8
  tgtId: Utf8
  weight: Int32
}

export type NodeStructure = {
  id: Utf8
  label: Utf8
  group: Utf8
}

type NodeTable = ArrowTable<NodeStructure>
type EdgeTable = ArrowTable<EdgeStructure>

type DataPreviewProps = {
  title?: string
  data?: Record<string, unknown>[]
  columns?: MUIDataTableColumnDef[]
  options?: Record<string, unknown>
}

const DataPreview = ({
  title = 'sample data table',
  data = sampleData,
  columns = sampleColumns,
  options = sampleOptions
}: DataPreviewProps): JSX.Element => {
  const { idCurrentStep } = useContext(WorkflowContext)

  const [nodes] = useStepInputValue<NodeTable>(idCurrentStep, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<EdgeTable>(idCurrentStep, 'edges', { fullValue: true })

  if (!nodes && !edges)
    return (
      <MUIDataTable
        // className={classes.root}
        title={title}
        data={data}
        columns={columns}
        options={options}
      />
    )

  return (
    <>
      <DataGrid data={nodes} condensed />
      <DataGrid data={edges} condensed />
    </>
  )
}

export default DataPreview
