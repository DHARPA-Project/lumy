import React from 'react'

import { useDataRepositoryItemValue } from '@lumy/client-core'
import { LoadingIndicator, TableView } from '@lumy/common-ui-components'

import useStyles from './DataRegistryItemContentPreview.styles'

const DataRegistryItemContentPreview = ({ id }: { id: string }): JSX.Element => {
  const classes = useStyles()

  const [
    dataSourceContentTablePreview,
    dataSourceContentMetadata
  ] = useDataRepositoryItemValue(id, { pageSize: 5}) // prettier-ignore

  return !!(dataSourceContentTablePreview?.type && dataSourceContentTablePreview?.schema) ? (
    <TableView table={dataSourceContentTablePreview} tableStats={dataSourceContentMetadata} />
  ) : (
    <div className={classes.missing}>
      <LoadingIndicator />
    </div>
  )
}

export default DataRegistryItemContentPreview
