import React from 'react'
import { List } from '@material-ui/core'
import useStyles from './NoteItemsList.styles'

export type Props = Parameters<typeof List>[0]

export const NoteItemsList: React.FC<Props> = ({ children }: Props): JSX.Element => {
  const classes = useStyles()
  return <List className={classes.root}>{children}</List>
}
