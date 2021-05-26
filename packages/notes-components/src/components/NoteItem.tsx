import React from 'react'
import { Note } from '@dharpa-vre/client-core'
import { ListItem, ListItemText } from '@material-ui/core'

export interface NoteItemProps {
  note: Note
}

export const NoteItem = ({ note, ...props }: NoteItemProps): JSX.Element => {
  return (
    <ListItem {...props}>
      <ListItemText>note: {JSON.stringify(note)}</ListItemText>
    </ListItem>
  )
}
