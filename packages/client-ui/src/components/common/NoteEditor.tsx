import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { NoteViewerEditor, NoteItemsList, NoteItem, EditedNote } from '@dharpa-vre/notes-components'
import AddIcon from '@material-ui/icons/Add'

import { Note, useCurrentWorkflow, useStepNotes } from '@dharpa-vre/client-core'
import { FormControl, InputLabel, Select, MenuItem, Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.background.default
  },
  headline: {
    margin: theme.spacing(2, 0)
  },
  breadcrumbs: {
    marginBottom: theme.spacing(3)
  },
  textEditor: {
    margin: theme.spacing(3, 0),
    '& .ql-container': {
      minHeight: theme.spacing(20)
    }
  },
  button: {
    marginTop: theme.spacing(3)
  }
}))

interface StepSelectorProps {
  stepId: string
  stepIds: string[]
  onStepIdSelected?: (stepId: string) => void
}
const StepSelector = ({ stepId, stepIds, onStepIdSelected }: StepSelectorProps): JSX.Element => {
  const [labelId] = useState(window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16))
  const handleChange = (id: string) => onStepIdSelected?.(id === '' ? undefined : id)

  return (
    <FormControl variant="outlined">
      <InputLabel id={`label-${labelId}`}>Step Id</InputLabel>
      <Select
        labelId={`label-${labelId}`}
        value={stepId ?? ''}
        onChange={e => handleChange(e.target.value as string)}
        label="Step Id"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {stepIds.map(id => (
          <MenuItem value={id} key={id}>
            {id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const NoteEditor = (): JSX.Element => {
  const classes = useStyles()
  const [selectedNote, setSelectedNote] = React.useState<Note | EditedNote>()

  const [workflow] = useCurrentWorkflow()
  const [currentStepId, setCurrentStepId] = useState<string>(undefined)
  const { notes, addNote, deleteNote, updateNote } = useStepNotes(currentStepId)

  return (
    <div className={classes.root}>
      {/* TODO: remove step selector once we can get current step from the context. */}
      <StepSelector
        stepId={currentStepId}
        stepIds={Object.keys(workflow?.steps ?? {})}
        onStepIdSelected={setCurrentStepId}
      />
      {selectedNote != null ? (
        <NoteViewerEditor
          note={selectedNote}
          onSave={note => {
            note?.id == null ? addNote(note) : updateNote(note as Note)
            setSelectedNote(undefined)
          }}
          onDelete={noteId => {
            deleteNote(noteId)
            setSelectedNote(undefined)
          }}
          onClose={() => setSelectedNote(undefined)}
        />
      ) : (
        <>
          <NoteItemsList>
            {notes?.map(note => (
              <NoteItem key={note.id} note={note} onClick={setSelectedNote} />
            ))}
          </NoteItemsList>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setSelectedNote({ content: '' })}
            style={{ width: '100%' }}
            disabled={currentStepId == null}
          >
            Add new note
          </Button>
        </>
      )}
    </div>
  )
}

export default NoteEditor
