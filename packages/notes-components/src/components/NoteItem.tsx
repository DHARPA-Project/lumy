import React from 'react'
import { Note } from '@lumy/client-core'
import { Box, Typography, ListItem, ListItemText } from '@material-ui/core'
import useStyles from './NoteItem.styles'
import { asTimeAgo } from '../util/render'
import { MarkdownRender } from './MarkdownRender'

export interface NoteItemProps {
  note: Note
  onClick?: (note: Note) => void
}

export const NoteItem = ({ note, onClick }: NoteItemProps): JSX.Element => {
  const classes = useStyles()
  if (note == null) return <></>
  return (
    <ListItem
      className={classes.noteItem}
      button={onClick != null ? true : undefined}
      classes={{ button: classes.buttonItem }}
      onClick={() => onClick?.(note)}
    >
      <Box className={classes.noteContentContainer}>
        <Box flexDirection="row" className={classes.noteItemContainer}>
          <div className={classes.fadeOverlay}></div>
          {note.title != null ? (
            <Typography variant="h6" component="p" className={classes.noteTitle}>
              {note?.title}
            </Typography>
          ) : (
            ''
          )}
          <ListItemText disableTypography primary={<MarkdownRender content={note.content} />} />
        </Box>
        <Typography variant="caption" className={classes.timestamp} color="textSecondary">
          {asTimeAgo(new Date(note.createdAt))}
        </Typography>
      </Box>
    </ListItem>
  )
}
