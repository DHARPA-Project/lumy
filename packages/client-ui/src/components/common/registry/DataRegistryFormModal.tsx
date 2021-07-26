import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { RowLike } from 'apache-arrow/type'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import Alert from '@material-ui/lab/Alert'

import SaveIcon from '@material-ui/icons/Save'

import {
  DataRepositoryItemStructure,
  ItemCreationMethod,
  useDataRepository,
  useDataRepositoryItemCreator
} from '@dharpa-vre/client-core'

import useStyles from './DataRegistryFormModal.styles'

import DialogModal from '../DialogModal'

type PageParams = {
  id?: string
}

const methods: ItemCreationMethod[] = ['table.from_csv', 'onboarding.file.import']

const DataRegistryFormModal = (): JSX.Element => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const params = useParams<PageParams>()

  const [selectedRegistryItem, setSelectedRegistryItem] = useState<RowLike<DataRepositoryItemStructure>>(null)

  const [sessionId, setSessionId] = useState(uuid())
  const [status, errorMessage, addItem, updateItem] = useDataRepositoryItemCreator(sessionId)
  const [method, setMethod] = useState<ItemCreationMethod>('table.from_csv')
  const [filePath, setFilePath] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [notes, setNotes] = useState<string>('')

  const [repositoryItems] = useDataRepository(null)

  useEffect(() => {
    if (
      location.pathname &&
      location.pathname.includes('/dataregistry/edit') &&
      params.id != null &&
      repositoryItems != null
    ) {
      const currentItem = [...(repositoryItems ?? [])].find(item => item.id === params.id)

      if (currentItem) {
        setSelectedRegistryItem(currentItem)
        setName(currentItem.label)
        setTags(currentItem.tags)
        setNotes(currentItem.notes)
      }
    }
  }, [location.pathname, params.id, repositoryItems])

  const resetForm = () => {
    setSessionId(uuid())
    setFilePath('')
    setName('')
    setTags('')
    setNotes('')
  }

  const handleSubmission = (event: React.FormEvent) => {
    event.preventDefault()

    selectedRegistryItem
      ? updateItem(selectedRegistryItem.id, { name, tags, notes })
      : addItem(method, filePath, name)
  }

  const formIsValid =
    methods.includes(method) && name.length > 0 && (selectedRegistryItem == null ? filePath.length > 0 : true)

  return (
    <DialogModal
      title={
        selectedRegistryItem != null
          ? `Edit data source "${params?.id ? params?.id : ''}"`
          : 'Add New Data Source'
      }
      isModalOpen={true}
      onCloseModalClick={() => history.push('/dataregistry')}
    >
      <form className={classes.form} autoComplete="off" onSubmit={handleSubmission}>
        <TextField
          select
          label="method"
          value={method}
          onChange={event => setMethod(event.target.value as ItemCreationMethod)}
          SelectProps={{ native: true }}
          variant="outlined"
        >
          {methods.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>

        {selectedRegistryItem == null && (
          <TextField
            label="file path"
            variant="outlined"
            required
            value={filePath}
            onChange={event => setFilePath(event.target.value)}
          />
        )}

        <TextField
          label="name"
          variant="outlined"
          required
          value={name}
          onChange={event => setName(event.target.value)}
        />

        <TextField
          label="tags"
          variant="outlined"
          value={tags}
          onChange={event => setTags(event.target.value)}
        />

        <TextField
          className={classes.noteArea}
          onChange={event => setNotes(event.target.value)}
          value={notes}
          variant="outlined"
          label="notes"
          multiline
        />

        {status === 'created' && (
          <Alert className={classes.notificationBox} severity="success">
            Successfully added new item to data registry.&nbsp;Successfully added new item to data registry.
            <span onClick={resetForm} className={classes.linkButton}>
              Add another one
            </span>
            .
          </Alert>
        )}
        {status === 'error' && (
          <Alert className={classes.notificationBox} severity="error">
            <Typography>{errorMessage ?? 'An error occurred'}</Typography>
          </Alert>
        )}

        <div className={classes.buttonContainer}>
          <Button
            disabled={!formIsValid || status === 'creating'}
            startIcon={status === 'creating' ? <CircularProgress size={18} /> : <SaveIcon />}
            variant="contained"
            color="default"
            size="small"
            type="submit"
          >
            {status === 'creating' ? 'saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </DialogModal>
  )
}

export default DataRegistryFormModal
