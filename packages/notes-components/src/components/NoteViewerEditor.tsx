import React from 'react'
import { Note } from '@dharpa-vre/client-core'
import { Grid, TextField, IconButton, Button } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import SaveIcon from '@material-ui/icons/Save'
import { MarkdownEditorViewer } from './MarkdownEditorViewer'

export interface Props {
  note?: Note
}

export const NoteViewerEditor = ({ note }: Props): JSX.Element => {
  const [title, setTitle] = React.useState(note?.title ?? '')
  const [content, setContent] = React.useState(note?.content ?? '')

  React.useCallback(() => setTitle(title), [note?.title ?? ''])

  return (
    <Grid container direction="column" wrap="nowrap">
      <Grid item>
        <Grid container wrap="nowrap">
          <TextField
            style={{ flexGrow: 1 }}
            label="Title"
            variant="standard"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <IconButton aria-label="close">
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Grid item>
        <MarkdownEditorViewer text={content} onChanged={setContent} />
      </Grid>
      <Grid item>
        <Grid container direction="column" wrap="nowrap">
          <Button variant="outlined" startIcon={<DeleteIcon />}>
            Delete this note
          </Button>
          <Button variant="outlined" startIcon={<SaveIcon />}>
            Save and close
          </Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
