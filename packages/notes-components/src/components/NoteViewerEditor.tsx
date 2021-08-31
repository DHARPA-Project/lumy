import React from 'react'
import { Note } from '@lumy/client-core'
import { Grid, TextField, IconButton, Button, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import { FormattedMessage, useIntl } from '@lumy/i18n'

import { MarkdownEditorViewer } from './MarkdownEditorViewer'
import useStyles from './NoteViewerEditor.styles'
import { asTimeAgo } from '../util/render'
import { withI18n } from '../locale'

export type EditedNote = Omit<Note, 'createdAt' | 'id'> & { id?: Note['id'] }

const isNoteValid = (note: EditedNote): boolean => {
  return (note?.content ?? '').length > 0
}
const notesAreEqual = (note: EditedNote, originalNote: Note | EditedNote): boolean => {
  return (
    (note?.id ?? null) === (originalNote?.id ?? null) &&
    note?.content === originalNote?.content &&
    note?.title === originalNote?.title
  )
}

export interface Props {
  note?: Note | EditedNote
  onSave?: (note: EditedNote) => void
  onDelete?: (noteId: string) => void
  onClose?: () => void
  showCloseButton?: boolean
}

const NoteViewerEditorComponent = ({
  note,
  onSave,
  onDelete,
  onClose,
  showCloseButton = true
}: Props): JSX.Element => {
  const [title, setTitle] = React.useState(note?.title ?? '')
  const [content, setContent] = React.useState(note?.content ?? '')
  const classes = useStyles()
  const intl = useIntl()

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
            placeholder={intl.formatMessage({ id: 'noteViewer.title.clickToEdit' })}
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
        {(note as Note)?.createdAt != null ? (
          <Typography variant="caption" color="textSecondary">
            {asTimeAgo(new Date((note as Note).createdAt))}
          </Typography>
        ) : (
          ''
        )}
      </Grid>
      <Grid item>
        <MarkdownEditorViewer
          text={content}
          onChanged={setContent}
          defaultTab={note?.id != null ? 'view' : 'edit'}
        />
      </Grid>
      <Grid item>
        <Grid container direction="column" wrap="nowrap" className={classes.noteActionButtonsContainer}>
          {note?.id != null ? (
            <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => onDelete?.(note?.id)}>
              <FormattedMessage id="noteViewer.button.deleteNote" />
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
            <FormattedMessage id="noteViewer.button.saveAndClose" />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}

export const NoteViewerEditor = withI18n(NoteViewerEditorComponent)
