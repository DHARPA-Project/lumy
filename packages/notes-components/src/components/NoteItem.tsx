import React from 'react'
import { Note } from '@dharpa-vre/client-core'
import { Box, Typography, ListItem, ListItemText } from '@material-ui/core'
import { formatDistance } from 'date-fns'
import useStyles from './NoteItem.styles'
import micromark from 'micromark'

const asTimeAgo = (date: Date): string => formatDistance(date, new Date(), { addSuffix: true })
const asHtml = (markdown: string): string => micromark(markdown)

export interface NoteItemProps {
  note: Note
}

export const NoteItem = ({ note }: NoteItemProps): JSX.Element => {
  const classes = useStyles()
  if (note == null) return <></>
  return (
    <ListItem className={classes.root} button classes={{ button: classes.buttonItem }}>
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
          <ListItemText
            disableTypography
            primary={<div dangerouslySetInnerHTML={{ __html: asHtml(note.content) }} />}
          />
        </Box>
        <Typography variant="caption" className={classes.timestamp}>
          {asTimeAgo(note.createdAt)}
        </Typography>
      </Box>
    </ListItem>
  )
}
