import React, { useContext, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import DoneIcon from '@material-ui/icons/Done'

import { ProjectContext, workflowCategories } from '../../context/projectContext'
import useStyles from './CreateProjectForm.styles'

type CreateProjectFormProps = {
  workflowCategory: string
  closeModal: () => void
}

const CreateProjectForm = ({ workflowCategory, closeModal }: CreateProjectFormProps): JSX.Element => {
  const classes = useStyles()

  const { addProject } = useContext(ProjectContext)

  const [workflowName, setWorkflowName] = useState<string>('')
  const [workflowType, setWorkflowType] = useState<string>(workflowCategory)
  const [workflowNameError, setWorkflowNameError] = useState<string>('')

  const validateForm = () => {
    let formValid = true

    // validate workflow name input
    if (!workflowName.length) {
      setWorkflowNameError('required field')
      formValid = false
    }

    return formValid
  }

  const clearValidationWarnings = () => {
    setWorkflowNameError('')
  }

  useEffect(() => {
    clearValidationWarnings()
    // clear all validation warnings whenever the following form values are updated
  }, [workflowName])

  const handleWorkflowNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWorkflowName(event.target.value)
  }

  const handleWorkflowTypeChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    setWorkflowType(event.target.value as string)
  }

  const handleProjectCreateSubmit = (event: React.FormEvent): void => {
    event.preventDefault()

    const isFormValid = validateForm()
    if (!isFormValid) return

    addProject(workflowName, workflowType as string)
    setWorkflowName('')
    setWorkflowType('')
    closeModal()
    window.alert('new project created!')
  }

  return (
    <form className={classes.newProjectForm} autoComplete="off">
      <TextField
        variant="outlined"
        size="small"
        label="workflow name"
        name="workflowName"
        value={workflowName}
        onChange={handleWorkflowNameChange}
        error={!!workflowNameError}
        helperText={workflowNameError}
      />

      <FormControl variant="outlined" size="small">
        <InputLabel>workflow type</InputLabel>
        <Select
          name="workflowType"
          label="Workflow Type"
          value={workflowType}
          onChange={handleWorkflowTypeChange}
        >
          {Object.values(workflowCategories).map(({ name }, index) => (
            <MenuItem key={index} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        className={classes.modalSubmitButton}
        type="submit"
        variant="contained"
        color="secondary"
        startIcon={<DoneIcon />}
        onClick={handleProjectCreateSubmit}
        size="medium"
      >
        Create
      </Button>
    </form>
  )
}

export default CreateProjectForm
