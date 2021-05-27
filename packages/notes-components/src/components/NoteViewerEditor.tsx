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

export interface Props {
  note?: Note
}

export const NoteViewerEditor = ({ note }: Props): JSX.Element => {
  const [title, setTitle] = React.useState(note?.title ?? '')
  const [content, setContent] = React.useState(note?.content ?? '')
  const classes = useStyles()

  React.useCallback(() => setTitle(title), [note?.title ?? ''])

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
          <IconButton aria-label="close" edge="end">
            <CloseIcon />
          </IconButton>
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
