import React from 'react'
import { Box, Grid } from '@material-ui/core'
import { NoteItem, NoteItemsList, NoteViewerEditor } from '@dharpa-vre/notes-components'

const PlaygroundPage = (): JSX.Element => {
  const testNotes = [
    {
      id: 'test1',
      content:
        '## boom Lorem \n**ipsum** dolor sit amet, consectetur adipiscing elit. Nulla eget nibh eget lorem porta venenatis ut vel massa. Aenean volutpat ex ac ex vehicula, pulvinar posuere elit elementum. Aenean in ante vel nulla finibus luctus non id eros. Fusce auctor tincidunt sem in vulputate. Sed finibus sollicitudin quam at bibendum. In eget ante id ligula pharetra egestas at quis lacus. Suspendisse potenti. Duis lacus enim, sagittis a consequat eget, tempus ut ante.',
      createdAt: new Date().toISOString()
    },
    {
      id: 'test2',
      content:
        'lorem ipsum [Lorem ipsum](https://www.dharpa.org) dolor sit amet, consectetur adipiscing elit. Nulla eget nibh eget lorem porta venenatis ut vel massa. Aenean volutpat ex ac ex vehicula, pulvinar posuere elit elementum. Aenean in ante vel nulla finibus luctus non id eros. Fusce auctor tincidunt sem in vulputate. Sed finibus sollicitudin quam at bibendum. In eget ante id ligula pharetra egestas at quis lacus. Suspendisse potenti. Duis lacus enim, sagittis a consequat eget, tempus ut ante.',
      createdAt: new Date().toISOString(),
      title: 'Note number two'
    }
  ]
  return (
    <div>
      <Grid container spacing={2} wrap="nowrap">
        <Grid item>
          <Box width="30rem">
            <NoteItemsList>
              {testNotes.map(note => (
                <NoteItem key={note.id} note={note} onClick={note => console.log('Note selected:', note)} />
              ))}
            </NoteItemsList>
          </Box>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <NoteViewerEditor
            note={testNotes[0]}
            onSave={note => console.log('Saving note:', note)}
            onDelete={noteId => console.log('Deleting note', noteId)}
            onClose={() => console.log('Closing without saving')}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default PlaygroundPage
