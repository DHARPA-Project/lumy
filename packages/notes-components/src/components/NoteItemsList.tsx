import React from 'react'

import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { FormattedMessage } from '@lumy/i18n'

import { withI18n } from '../locale'
import useStyles from './NoteItemsList.styles'

export type NoteListProps = {
  children: React.ReactChild[]
}

export const NoteItemsListComponent: React.FC<NoteListProps> = ({ children }: NoteListProps) => {
  const classes = useStyles()

  if (!children.length)
    return (
      <Card className={classes.card}>
        <Typography variant="subtitle1" component="h3" align="center">
          <FormattedMessage id="noteItemsList.noNotes" />
        </Typography>
      </Card>
    )

  return <List className={classes.noteList}>{children}</List>
}

export const NoteItemsList = withI18n(NoteItemsListComponent)
