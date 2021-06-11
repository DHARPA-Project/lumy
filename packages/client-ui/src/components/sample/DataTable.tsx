import React from 'react'

import MUIDataTable, { FilterType, MUIDataTableColumnDef } from 'mui-datatables'

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

const sampleTitle = 'sample data table'

type DataTableProps = {
  title?: string
  data?: Record<string, unknown>[]
  columns?: MUIDataTableColumnDef[]
  options?: Record<string, unknown>
}

const DataTable = ({
  title = sampleTitle,
  data = sampleData,
  columns = sampleColumns,
  options = sampleOptions
}: DataTableProps): JSX.Element => {
  return <MUIDataTable title={title} data={data} columns={columns} options={options} />
}

export default DataTable
