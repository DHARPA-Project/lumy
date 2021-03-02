from typing import Optional, Callable
from tinypubsub.simple import SimplePublisher

from dharpa.vre.context.context import AppContext
from dharpa.vre.context.types import Workflow, WorkflowStructure

WorkflowStructureUpdated = Callable[[WorkflowStructure], None]


class MockAppContext(AppContext):
    _current_workflow: Optional[Workflow] = None

    _event_workflow_structure_updated = SimplePublisher[WorkflowStructure]()

    def __init__(self):
        # TODO: load mock workflow here
        pass

    def load_workflow(self, workflow: Workflow) -> None:
        # TODO: resolve modules from every step of the workflow
        self._current_workflow = workflow
        self._event_workflow_structure_updated.publish(
            self._current_workflow.structure)

    @property
    def current_workflow(self):
        return self._current_workflow

    @property
    def workflow_structure_updated(self):
        return self._event_workflow_structure_updated
