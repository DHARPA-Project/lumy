import React, { useContext } from 'react'
import { Table as ArrowTable, Int32, Utf8 } from 'apache-arrow'
import { makeStyles } from '@material-ui/core/styles'

import { TableStats, TabularDataFilter, useStepInputValue } from '@dharpa-vre/client-core'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'

import { WorkflowContext } from '../../context/workflowContext'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'

const useStyles = makeStyles(theme => ({
  card: {
    margin: theme.spacing(5),
    padding: theme.spacing(2)
  }
}))

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

const DataPreview = (): JSX.Element => {
  const classes = useStyles()
  const { idCurrentStep } = useContext(WorkflowContext)

  const [nodes] = useStepInputValue<NodeTable>(idCurrentStep, 'nodes', { fullValue: true })
  const [edges] = useStepInputValue<EdgeTable>(idCurrentStep, 'edges', { fullValue: true })
  const [nodesFilter, setNodeFilter] = React.useState<TabularDataFilter>({ pageSize: 10 })
  const [nodesPage, , nodesStats] = useStepInputValue<NodeTable, TableStats>(
    idCurrentStep,
    'nodes',
    nodesFilter
  )

  if (!nodes && !edges)
    return (
      <Card className={classes.card}>
        <Typography variant="h5" component="h1" align="center">
          No data available for this step
        </Typography>
      </Card>
    )

  return (
    <>
      <DataGrid
        data={nodesPage}
        stats={nodesStats}
        filter={nodesFilter}
        onFiltering={setNodeFilter}
        condensed
        sortingEnabled
        filteringEnabled
      />
    </>
  )
}

export default DataPreview
