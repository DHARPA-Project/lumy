import React from 'react'
import { Note } from '@dharpa-vre/client-core'
import { Grid, TextField, IconButton, Button, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import { MarkdownEditorViewer } from './MarkdownEditorViewer'
import useStyles from './NoteViewerEditor.styles'
import { formatDistance } from 'date-fns'

const asTimeAgo = (date: Date): string => formatDistance(date, new Date(), { addSuffix: true })

export type EditedNote = Omit<Note, 'createdAt' | 'id'> & { id?: Note['id'] }

const isNoteValid = (note: EditedNote): boolean => {
  return (note?.content ?? '').length > 0
}
const notesAreEqual = (note: EditedNote, originalNote: Note): boolean => {
  return (
    (note?.id ?? null) === (originalNote?.id ?? null) &&
    note?.content === originalNote?.content &&
    note?.title === originalNote?.title
  )
}

export interface Props {
  note?: Note
  onSave?: (note: EditedNote) => void
  onDelete?: (noteId: string) => void
  onClose?: () => void
  showCloseButton: boolean
}

export const NoteViewerEditor = ({
  note,
  onSave,
  onDelete,
  onClose,
  showCloseButton = true
}: Props): JSX.Element => {
  const [title, setTitle] = React.useState(note?.title ?? '')
  const [content, setContent] = React.useState(note?.content ?? '')
  const classes = useStyles()

  React.useCallback(() => setTitle(title), [note?.title ?? ''])

  const editedNote: EditedNote = {
    title: title?.trim()?.length > 0 ? title : undefined,
    content
  }
  if (note?.id != null) editedNote.id = note?.id

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item>
        <Grid container wrap="nowrap">
          <TextField
            placeholder="Click to edit title"
            className={classes.titleField}
            variant="standard"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          {showCloseButton ? (
            <IconButton aria-label="close" edge="end" onClick={() => onClose?.()}>
              <CloseIcon />
            </IconButton>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
      <Grid item>
        {note?.createdAt != null ? (
          <Typography variant="caption" color="textSecondary">
            {asTimeAgo(note.createdAt)}
          </Typography>
        ) : (
          ''
        )}
      </Grid>
      <Grid item>
        <MarkdownEditorViewer text={content} onChanged={setContent} />
      </Grid>
      <Grid item>
        <Grid container direction="column" wrap="nowrap" className={classes.noteActionButtonsContainer}>
          {note?.id != null ? (
            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => onDelete?.(note?.id)}>
              Delete this note
            </Button>
          ) : (
            ''
          )}
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => onSave?.(editedNote)}
            disabled={!isNoteValid(editedNote) || notesAreEqual(editedNote, note)}
          >
            Save and close
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
