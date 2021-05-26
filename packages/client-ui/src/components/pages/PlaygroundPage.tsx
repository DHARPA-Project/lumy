import React from 'react'
import { Box } from '@material-ui/core'
import { NoteItem, NoteItemsList } from '@dharpa-vre/notes-components'

const PlaygroundPage = (): JSX.Element => {
  const testNotes = [
    {
      id: 'test1',
      content:
        '## boom Lorem \n**ipsum** dolor sit amet, consectetur adipiscing elit. Nulla eget nibh eget lorem porta venenatis ut vel massa. Aenean volutpat ex ac ex vehicula, pulvinar posuere elit elementum. Aenean in ante vel nulla finibus luctus non id eros. Fusce auctor tincidunt sem in vulputate. Sed finibus sollicitudin quam at bibendum. In eget ante id ligula pharetra egestas at quis lacus. Suspendisse potenti. Duis lacus enim, sagittis a consequat eget, tempus ut ante.',
      createdAt: new Date()
    },
    {
      id: 'test2',
      content:
        'lorem ipsum [Lorem ipsum](https://www.dharpa.org) dolor sit amet, consectetur adipiscing elit. Nulla eget nibh eget lorem porta venenatis ut vel massa. Aenean volutpat ex ac ex vehicula, pulvinar posuere elit elementum. Aenean in ante vel nulla finibus luctus non id eros. Fusce auctor tincidunt sem in vulputate. Sed finibus sollicitudin quam at bibendum. In eget ante id ligula pharetra egestas at quis lacus. Suspendisse potenti. Duis lacus enim, sagittis a consequat eget, tempus ut ante.',
      createdAt: new Date(),
      title: 'Note number two'
    }
  ]
  return (
    <div>
      <Box width="30rem">
        <NoteItemsList>
          {testNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))}
        </NoteItemsList>
      </Box>
    </div>
  )
}

export default PlaygroundPage
