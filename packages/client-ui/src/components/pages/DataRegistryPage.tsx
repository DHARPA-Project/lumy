import React, { useState, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { Utf8Vector } from 'apache-arrow'

import Container from '@material-ui/core/Container'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'

import Alert from '@material-ui/lab/Alert'

import { useDataRepository } from '@lumy/client-core'
import { InteractiveTable } from '@lumy/common-ui-components'

import useStyles from './DataRegistryPage.styles'
import DataRegistryItemContentPreview from '../common/registry/DataRegistryItemContentPreview'
import { useIntl, IntlShape } from '@lumy/i18n'

type TableColumnFilterTypes = 'multi-string-include' | null

type ColumnMap = {
  label: string
  key: string
  visible?: boolean
  sortable?: boolean
  searchable?: boolean
  filterType?: TableColumnFilterTypes
  numeric?: boolean
}

interface ITableItem {
  id: string
  [x: string]: string
}

const getColumnMapList = (
  intl: IntlShape,
  messageIdPrefix = 'page.dataRegistry.table.columns'
): ColumnMap[] => [
  {
    label: intl.formatMessage({ id: `${messageIdPrefix}.name.label` }),
    key: 'label',
    visible: true,
    sortable: true,
    searchable: true,
    filterType: null,
    numeric: false
  },
  {
    label: intl.formatMessage({ id: `${messageIdPrefix}.type.label` }),
    key: 'type',
    visible: true,
    sortable: true,
    searchable: false,
    filterType: 'multi-string-include' as TableColumnFilterTypes,
    numeric: false
  },
  {
    label: intl.formatMessage({ id: `${messageIdPrefix}.tags.label` }),
    key: 'tags',
    visible: true,
    sortable: false,
    searchable: false,
    filterType: 'multi-string-include' as TableColumnFilterTypes,
    numeric: false
  },
  {
    label: intl.formatMessage({ id: `${messageIdPrefix}.notes.label` }),
    key: 'notes',
    visible: true,
    sortable: false,
    searchable: false,
    filterType: null,
    numeric: false
  },
  {
    label: intl.formatMessage({ id: `${messageIdPrefix}.columnNames.label` }),
    key: 'columnNames',
    visible: false,
    sortable: false,
    searchable: false,
    filterType: null,
    numeric: false
  },
  {
    label: intl.formatMessage({ id: `${messageIdPrefix}.columnTypes.label` }),
    key: 'columnTypes',
    visible: false,
    sortable: false,
    searchable: false,
    filterType: 'multi-string-include' as TableColumnFilterTypes,
    numeric: false
  }
]

const DataRegistryPage: React.FC = () => {
  const history = useHistory()
  const classes = useStyles()
  const intl = useIntl()
  const columnMapList = useMemo(() => getColumnMapList(intl), [intl])

  const [isSnackBarVisible, setIsSnackBarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const [repositoryItems] = useDataRepository({ pageSize: 1000 })

  const repositoryItemList = [...(repositoryItems ?? [])].map(item => {
    // early return if undefined/null or not iterable
    if (item == null || typeof item[Symbol.iterator] !== 'function') return {}

    return [...item].reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value instanceof Utf8Vector ? [...(value ?? [])] : value
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
    console.info(`must remove items with IDs:\n${idList.sort((a, b) => (a > b ? 1 : -1)).join(',\n')}`)
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
        title={intl.formatMessage({ id: 'page.dataRegistry.table.title' })}
        rowList={repositoryItemList as ITableItem[]}
        columnMapList={columnMapList}
        isSearchEnabled={true}
        onAddItemClick={handleAddItemClick}
        // onEditItemClick={handleEditItemClick}
        onDeleteSelectedItems={deleteRepositoryItems}
        getItemContentPreview={(id: string) => <DataRegistryItemContentPreview id={id} />}
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
