import React, { useContext, useState } from 'react'

import Button from '@material-ui/core/Button'

import AddIcon from '@material-ui/icons/Add'

import {
  NoteViewerEditor,
  NoteItemsList,
  NoteItem,
  EditedNote as EditedNoteType
} from '@dharpa-vre/notes-components'
import { Note as NoteType, useStepNotes } from '@dharpa-vre/client-core'

import useStyles from './NoteEditor.styles'
import { WorkflowContext } from '../../state'
import { FormattedMessage } from 'react-intl'

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
            onClick={() => setSelectedNote({ content: '' })}
            disabled={currentPageDetails == null}
            className={classes.newNoteButton}
            startIcon={<AddIcon />}
            variant="contained"
            color="default"
            size="small"
            fullWidth
          >
            <FormattedMessage id="panel.noteEditor.button.newNote" />
          </Button>
        </>
      )}
    </div>
  )
}

export default NoteEditor
