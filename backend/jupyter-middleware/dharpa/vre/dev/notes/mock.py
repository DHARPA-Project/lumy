
from collections import defaultdict
from typing import Dict, List
from uuid import uuid4
from dharpa.vre.types.generated import Note


def generate_id() -> str:
    return str(uuid4())


class MockNotesStore:
    __instance = None
    notes: Dict[str, List[Note]] = defaultdict(list)

    @staticmethod
    def get_instance():
        if MockNotesStore.__instance is None:
            MockNotesStore.__instance = MockNotesStore()

        return MockNotesStore.__instance

    def get_notes(self, step_id: str) -> List[Note]:
        return self.notes[step_id]

    def add_note(self, step_id: str, note: Note):
        notes = self.notes[step_id]
        notes.append(Note(content=note.content, id=generate_id()))
        self.notes[step_id] = notes

    def update_note(self, step_id: str, note: Note):
        notes = self.notes[step_id]
        for n in notes:
            if n.id == note.id:
                n.content = note.content

    def delete_note(self, step_id: str, note_id: str):
        notes = [n for n in self.notes[step_id] if n.id != note_id]
        self.notes[step_id] = notes
