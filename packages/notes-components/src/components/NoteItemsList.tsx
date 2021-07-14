import React from 'react'

import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'

import useStyles from './NoteItemsList.styles'

export type NoteListProps = {
  children: React.ReactChild[]
}

export const NoteItemsList: React.FC<NoteListProps> = ({ children }: NoteListProps) => {
  const classes = useStyles()

  if (!children.length)
    return (
      <Card className={classes.card}>
        <Typography variant="subtitle1" component="h3" align="center">
          No notes available for this step
        </Typography>
      </Card>
    )

  return <List className={classes.noteList}>{children}</List>
}
