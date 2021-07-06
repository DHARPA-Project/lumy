import React from 'react'
import { v4 as uuid } from 'uuid'
import { useDataRepositoryItemCreator } from '@dharpa-vre/client-core'

const AddDataRegistryItemPage = (): JSX.Element => {
  const [sessionId, setSessionId] = React.useState(uuid())
  const [status, addItem, errorMessage] = useDataRepositoryItemCreator(sessionId)

  return <div>[AddDataRegistryItemPage placeholder]</div>
}

export default AddDataRegistryItemPage
