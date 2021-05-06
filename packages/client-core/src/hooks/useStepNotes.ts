import { useContext, useEffect, useState } from 'react'
import { BackEndContext, handlerAdapter, Target } from '../common/context'
import { Messages, Note } from '../common/types'

type NewNote = Omit<Note, 'id'>

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
        setNotes(content.notes)
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
        note: { ...note, id: '' },
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
        note
      })
    )
  }

  return { notes, addNote, deleteNote, updateNote }
}
