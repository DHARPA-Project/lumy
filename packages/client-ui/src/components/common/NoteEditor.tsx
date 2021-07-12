import React, { useContext, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import AddIcon from '@material-ui/icons/Add'

import {
  NoteViewerEditor,
  NoteItemsList,
  NoteItem,
  EditedNote as EditedNoteType
} from '@dharpa-vre/notes-components'
import { Note as NoteType, useStepNotes } from '@dharpa-vre/client-core'

import { WorkflowContext } from '../../context/workflowContext'

const useStyles = makeStyles(theme => ({
  noteEditor: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default
  }
}))

const NoteEditor = (): JSX.Element => {
  const classes = useStyles()

  const { currentPageDetails } = useContext(WorkflowContext)
  const { notes, addNote, deleteNote, updateNote } = useStepNotes(currentPageDetails?.id)
  const [selectedNote, setSelectedNote] = useState<NoteType | EditedNoteType>()

  return (
    <div className={classes.noteEditor}>
      {selectedNote != null ? (
        <NoteViewerEditor
          note={selectedNote}
          onSave={(note: EditedNoteType) => {
            note?.id == null ? addNote(note) : updateNote(note as NoteType)
            setSelectedNote(undefined)
          }}
          onDelete={(noteId: string) => {
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
            disabled={currentPageDetails == null}
          >
            new note
          </Button>
        </>
      )}
    </div>
  )
}

export default NoteEditor
