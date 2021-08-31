import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { RowLike } from 'apache-arrow/type'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Collapse from '@material-ui/core/Collapse'

import Alert from '@material-ui/lab/Alert'

import SaveIcon from '@material-ui/icons/Save'
import DeleteIcon from '@material-ui/icons/Delete'

import {
  DataRepositoryItemStructure,
  ItemCreationMethod,
  useDataRepository,
  useDataRepositoryItemCreator
} from '@lumy/client-core'

import useStyles from './DataRegistryFormModal.styles'

import DialogModal from '../DialogModal'
import { FormattedMessage, useIntl } from '@lumy/i18n'

type PageParams = {
  id?: string
}

const methods: ItemCreationMethod[] = ['table.from_csv', 'onboarding.file.import']

type FormValues = {
  method: ItemCreationMethod
  path: string
  name: string
  tags: string
  notes: string
}

type StatusMessage = {
  severity: 'success' | 'error'
  text: string
}

const initialFormValues: FormValues = {
  method: 'table.from_csv',
  path: '',
  name: '',
  tags: '',
  notes: ''
}

const DataRegistryFormModal = (): JSX.Element => {
  const classes = useStyles()
  const history = useHistory()
  const { pathname } = useLocation()
  const intl = useIntl()
  const { id: registryItemID } = useParams<PageParams>()

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues)
  const [formErrors, setFormErrors] = useState<Record<string, string>>(null)
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null)
  const [selectedRegistryItem, setSelectedRegistryItem] = useState<RowLike<DataRepositoryItemStructure>>(null)
  const [sessionId, setSessionId] = useState(uuid())
  const [itemCreationStatus, addItem, errorMessage] = useDataRepositoryItemCreator(sessionId)
  const [repositoryItems] = useDataRepository({ pageSize: 1000 })

  useEffect(() => {
    if (
      pathname &&
      pathname.includes('/dataregistry/edit') &&
      registryItemID != null &&
      repositoryItems != null
    ) {
      const currentItem = [...(repositoryItems ?? [])].find(item => item.id === registryItemID)

      if (currentItem) {
        setSelectedRegistryItem(currentItem)
        setFormValues(prevValues => ({
          ...prevValues,
          name: currentItem.label
          // tags: currentItem.tags,
          // notes: currentItem.notes
        }))
      }
    }
  }, [pathname, registryItemID, repositoryItems])

  useEffect(() => {
    if (itemCreationStatus === 'created') {
      setFormValues(initialFormValues)
      setStatusMessage({
        severity: 'success',
        text: intl.formatMessage({ id: 'modal.dataRegistry.message.itemAdded' })
      })
    } else if (itemCreationStatus === 'error') {
      setStatusMessage({
        severity: 'error',
        text: intl.formatMessage(
          { id: 'modal.dataRegistry.message.addItemFailed' },
          { error: errorMessage ?? '' }
        )
      })
    } else {
      setStatusMessage(null)
    }
  }, [itemCreationStatus])

  const getFormValidationErrors = (values: Record<string, string>) => {
    const newErrors = { ...formErrors }

    if (selectedRegistryItem == null && 'method' in values) {
      newErrors.method = methods.includes(values.method as ItemCreationMethod)
        ? ''
        : intl.formatMessage({ id: 'modal.dataRegistry.message.invalidMethodSelected' })
    }
    if (selectedRegistryItem == null && 'path' in values) {
      newErrors.path =
        values.path.length > 0
          ? ''
          : intl.formatMessage({ id: 'modal.dataRegistry.message.filePathRequired' })
    }
    if ('name' in values) {
      newErrors.name =
        values.name.length > 5 ? '' : intl.formatMessage({ id: 'modal.dataRegistry.message.nameTooShort' })
    }

    return newErrors
  }

  const formIsValid = Object.values(getFormValidationErrors(formValues)).every(v => v === '')

  const updateItem = (itemId: string, itemDetails: Record<string, unknown>): void => {
    /**
     * TODO: complete when back-end support becomes available
     */
    console.log(`updating registry item ${itemId} with values: `, itemDetails)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setFormValues(prevValues => ({ ...prevValues, [name]: value }))
    setFormErrors(getFormValidationErrors({ [name]: value }))
    if (statusMessage) {
      setSessionId(uuid())
    }
  }

  const resetForm = () => {
    setFormValues(initialFormValues)
    setFormErrors(null)
    setStatusMessage(null)
  }

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault()

    selectedRegistryItem
      ? updateItem(selectedRegistryItem.id, {
          name: formValues.name,
          tags: formValues.tags,
          notes: formValues.notes
        })
      : addItem(formValues.method, formValues.path, formValues.name)
  }

  return (
    <DialogModal
      title={
        selectedRegistryItem != null
          ? intl.formatMessage(
              { id: 'modal.dataRegistry.label.edit' },
              { dataSource: registryItemID ? registryItemID : '' }
            )
          : intl.formatMessage({ id: 'modal.dataRegistry.label.add' })
      }
      isModalOpen={true}
      onCloseModalClick={() => history.push('/dataregistry')}
    >
      <form className={classes.form} autoComplete="off" onSubmit={handleFormSubmission}>
        {selectedRegistryItem == null && (
          <>
            <TextField
              select
              name="method"
              label={intl.formatMessage({ id: 'modal.dataRegistry.form.field.method.label' })}
              value={formValues.method}
              onChange={handleInputChange}
              SelectProps={{ native: true }}
              variant="outlined"
              className={classes.field}
              {...(!!formErrors?.method && { error: true, helperText: formErrors?.method })}
            >
              {methods.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </TextField>

            <TextField
              name="path"
              label={intl.formatMessage({ id: 'modal.dataRegistry.form.field.filePath.label' })}
              variant="outlined"
              required
              value={formValues.path}
              onChange={handleInputChange}
              className={classes.field}
              {...(!!formErrors?.path && { error: true, helperText: formErrors?.path })}
            />
          </>
        )}

        <TextField
          name="name"
          label={intl.formatMessage({ id: 'modal.dataRegistry.form.field.name.label' })}
          variant="outlined"
          required
          value={formValues.name}
          onChange={handleInputChange}
          className={classes.field}
          {...(!!formErrors?.name && { error: true, helperText: formErrors?.name })}
        />

        <TextField
          name="tags"
          label={intl.formatMessage({ id: 'modal.dataRegistry.form.field.tags.label' })}
          variant="outlined"
          value={formValues.tags}
          onChange={handleInputChange}
          className={classes.field}
          {...(!!formErrors?.tags && { error: true, helperText: formErrors?.tags })}
          disabled // disabled because not yet supported by back-end
        />

        <TextField
          name="notes"
          label={intl.formatMessage({ id: 'modal.dataRegistry.form.field.notes.label' })}
          variant="outlined"
          multiline
          className={classes.noteArea}
          value={formValues.notes}
          onChange={handleInputChange}
          {...(!!formErrors?.notes && { error: true, helperText: formErrors?.notes })}
          disabled // disabled because not yet supported by back-end
        />

        <Collapse in={!!statusMessage} className={classes.notificationBox}>
          <Alert severity={statusMessage?.severity}>
            <Typography>{statusMessage?.text}</Typography>
          </Alert>
        </Collapse>

        <div className={classes.buttonContainer}>
          <Button
            startIcon={<DeleteIcon />}
            variant="contained"
            color="default"
            size="small"
            onClick={resetForm}
          >
            <FormattedMessage id="modal.dataRegistry.button.reset" />
          </Button>

          <Button
            disabled={!formIsValid || itemCreationStatus === 'creating'}
            startIcon={itemCreationStatus === 'creating' ? <CircularProgress size={18} /> : <SaveIcon />}
            variant="contained"
            color="default"
            size="small"
            type="submit"
          >
            <FormattedMessage
              id={
                itemCreationStatus === 'creating'
                  ? 'modal.dataRegistry.button.saving'
                  : 'modal.dataRegistry.button.save'
              }
            />
          </Button>
        </div>
      </form>
    </DialogModal>
  )
}

export default DataRegistryFormModal
