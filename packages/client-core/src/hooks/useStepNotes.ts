import { useContext, useEffect, useState } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, Note } from '../common/types'

const deserializeNote = (note: Note): Note => {
  if (typeof note?.createdAt === 'string') note.createdAt = new Date(note.createdAt)
  return note
}
const serializeNote = (note: Note): Note => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof note?.createdAt !== 'string') (note as any).createdAt = note.createdAt.toUTCString()
  return note
}

type NewNote = Omit<Note, 'id' | 'createdAt'>

export interface StepNoteHookResult {
  notes: Note[]
  addNote: (note: NewNote) => void
  deleteNote: (noteId: string) => void
  updateNote: (note: Note) => void
}

export function useStepNotes(stepId: string): StepNoteHookResult {
  const context = useContext(BackEndContext)
  const [notes, setNotes] = useState<Note[]>([])

  const getValue = () => {
    const msg = Messages.Notes.codec.GetNotes.encode({ stepId })
    context.sendMessage(Target.Notes, msg)
  }

  useEffect(() => {
    if (stepId == null) return

    const handler = handlerAdapter(Messages.Notes.codec.Notes.decode, content => {
      if (content.stepId === stepId) {
        setNotes(content.notes?.map(deserializeNote))
      }
    })
    context.subscribe(Target.Notes, handler)
    getValue()
    return () => context.unsubscribe(Target.Notes, handler)
  }, [stepId])

  const addNote = (note: NewNote) => {
    if (stepId == null) return

    context.sendMessage(
      Target.Notes,
      Messages.Notes.codec.Add.encode({
        note: serializeNote({ ...note, id: '', createdAt: new Date() }),
        stepId
      })
    )
  }

  const deleteNote = (noteId: string) => {
    if (stepId == null) return

    context.sendMessage(
      Target.Notes,
      Messages.Notes.codec.Delete.encode({
        stepId,
        noteId
      })
    )
  }

  const updateNote = (note: Note) => {
    if (stepId == null) return

    context.sendMessage(
      Target.Notes,
      Messages.Notes.codec.Update.encode({
        stepId,
        note: serializeNote(note)
      })
    )
  }

  return { notes, addNote, deleteNote, updateNote }
}
