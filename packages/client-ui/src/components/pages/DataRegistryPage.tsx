import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Utf8Vector } from 'apache-arrow'

import Container from '@material-ui/core/Container'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'

import Alert from '@material-ui/lab/Alert'

import { useDataRepository } from '@dharpa-vre/client-core'
import { InteractiveTable } from '@dharpa-vre/common-ui-components'

import useStyles from './DataRegistryPage.styles'
import DataRegistryItemContentPreview from '../common/registry/DataRegistryItemContentPreview'

interface ITableItem {
  id: string
  [x: string]: string
}

const columnMapList = [
  {
    label: 'name',
    key: 'label',
    visible: true,
    sortable: true,
    numeric: false
  },
  {
    label: 'type',
    key: 'type',
    visible: true,
    sortable: true,
    numeric: false
  },
  {
    label: 'tags',
    key: 'tags',
    visible: true,
    sortable: false,
    numeric: false
  },
  {
    label: 'notes',
    key: 'notes',
    visible: true,
    sortable: false,
    numeric: false
  },
  {
    label: 'column names',
    key: 'columnNames',
    visible: false,
    sortable: false,
    numeric: false
  },
  {
    label: 'column types',
    key: 'columnTypes',
    visible: false,
    sortable: false,
    numeric: false
  }
]

const DataRegistryPage: React.FC = () => {
  const history = useHistory()
  const classes = useStyles()

  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [repositoryItems] = useDataRepository({ pageSize: 1000 })

  const repositoryItemList = [...(repositoryItems ?? [])].map(item => {
    // early return if undefined/null or not iterable
    if (item == null || typeof item[Symbol.iterator] !== 'function') return {}

    return [...item].reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value instanceof Utf8Vector ? [...(value ?? [])].join(', ') : value
      }),
      {}
    )
  })

  const handleSnackbarClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setIsSnackBarVisible(false)
  }

  /**
   * Delete all the data items with the provided IDs from the data registry
   * @param idList list of the IDs of the registry items to be removed
   */
  const deleteRepositoryItems = (idList: string[]): void => {
    /**
     * TODO: implement when the back-end can support this function
     */
    console.info(`removing items with IDs:\n${idList.sort((a, b) => (a > b ? 1 : -1)).join(',\n')}`)
    setSnackbarMessage('item removal coming up soon')
    setIsSnackBarVisible(true)
  }

  // pending back-end implementation
  // const handleEditItemClick = (itemId: string) => {
  //   history.push(`/dataregistry/edit/${itemId}`)
  // }

  const handleAddItemClick = () => {
    history.push('/dataregistry/add')
  }

  return (
    <Container classes={{ root: classes.registryPageContainer }}>
      <InteractiveTable
        title={'Data Registry'}
        itemList={repositoryItemList as ITableItem[]}
        columnMapList={columnMapList}
        isSearchEnabled={true}
        onAddItemClick={handleAddItemClick}
        // onEditItemClick={handleEditItemClick}
        onDeleteSelectedItems={deleteRepositoryItems}
        getItemContentPreview={id => <DataRegistryItemContentPreview id={id} />}
      />

      <Snackbar
        open={isSnackBarVisible}
        onClose={handleSnackbarClose}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="left" />}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default DataRegistryPage
