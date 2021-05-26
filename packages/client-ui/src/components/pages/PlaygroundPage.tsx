import React from 'react'
import { Box } from '@material-ui/core'
import { NoteItem } from '@dharpa-vre/notes-components'

const PlaygroundPage = (): JSX.Element => {
  const testNotes = [{ id: 'test1', content: 'lorem ipsum' }]
  return (
    <div>
      <Box width="10rem">
        <NoteItem note={testNotes[0]} />
      </Box>
    </div>
  )
}

export default PlaygroundPage
