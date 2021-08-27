import React, { useContext } from 'react'
import { Table } from 'apache-arrow'

import {
  TableStats,
  TabularDataFilter,
  useStepInputValue,
  useStepOutputValue,
  DataPreviewLayoutMetadataItem,
  InputOrOutput
} from '@dharpa-vre/client-core'
import { DataGrid } from '@dharpa-vre/arrow-data-grid'

import { WorkflowContext } from '../../state'

import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import { CircularProgress, Grid } from '@material-ui/core'

import useStyles from './DataPreview.styles'

interface DataPreviewContainerProps {
  pageId: string
  item: DataPreviewLayoutMetadataItem
}

interface DataPreviewRendererProps {
  value: unknown
  stats: unknown
  filter: unknown
  setFilter: (v: unknown) => void
}

const DataPreviewRenderer = ({ value, stats, filter, setFilter }: DataPreviewRendererProps): JSX.Element => {
  const classes = useStyles()

  if (value == null) return <CircularProgress size="sm" classes={{ root: classes.progress }} />
  if (value instanceof Table)
    return (
      <DataGrid
        data={value as Table}
        stats={stats as TableStats}
        filter={filter}
        onFiltering={setFilter}
        condensed
        sortingEnabled
        filteringEnabled
      />
    )
  // TODO: handle other types when ready
  return <pre>{value.toString()}</pre>
}

const InputDataPreviewContainer = ({ item, pageId }: DataPreviewContainerProps): JSX.Element => {
  const [tableFilter, setTableFilter] = React.useState<TabularDataFilter>({ pageSize: 10 })
  const [value, , stats] = useStepInputValue<unknown, unknown>(pageId, item.id, tableFilter)
  return <DataPreviewRenderer value={value} stats={stats} filter={tableFilter} setFilter={setTableFilter} />
}

const OutputDataPreviewContainer = ({ item, pageId }: DataPreviewContainerProps): JSX.Element => {
  const [tableFilter, setTableFilter] = React.useState<TabularDataFilter>({ pageSize: 10 })
  const [value, stats] = useStepOutputValue<unknown, unknown>(pageId, item.id, tableFilter)
  return <DataPreviewRenderer value={value} stats={stats} filter={tableFilter} setFilter={setTableFilter} />
}

const DataPreview = (): JSX.Element => {
  const classes = useStyles()
  const { currentPageDetails } = useContext(WorkflowContext)

  const dataPreviewItems = currentPageDetails?.layout?.dataPreview ?? []

  if (dataPreviewItems.length == 0)
    return (
      <Card className={classes.card}>
        <Typography variant="subtitle1" component="h3" align="center">
          No data available for this step
        </Typography>
      </Card>
    )

  return (
    <Grid container direction="column" spacing={2}>
      {dataPreviewItems.map((item, idx) => (
        <Grid item key={idx} classes={{ root: classes.gridItemRoot }}>
          {item.type === InputOrOutput.Input ? (
            <InputDataPreviewContainer item={item} pageId={currentPageDetails?.id} />
          ) : (
            <OutputDataPreviewContainer item={item} pageId={currentPageDetails?.id} />
          )}
        </Grid>
      ))}
    </Grid>
  )
}

export default DataPreview
