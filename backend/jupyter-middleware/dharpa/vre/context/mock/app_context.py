import importlib.resources as pkg_resources
from typing import Optional, Callable
from tinypubsub.simple import SimplePublisher
import yaml
try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader
from dacite import from_dict

from dharpa.vre.context.context import AppContext
from dharpa.vre.context.types import Workflow, WorkflowStructure
from dharpa.vre.context.mock import resources

WorkflowStructureUpdated = Callable[[WorkflowStructure], None]


class MockAppContext(AppContext):
    _current_workflow: Optional[Workflow] = None

    _event_workflow_structure_updated = SimplePublisher[WorkflowStructure]()

    def __init__(self):
        workflow_file_content = pkg_resources.open_text(
            resources, 'sample_workflow_1.yml')
        workflow = from_dict(data_class=Workflow, data=yaml.load(
            workflow_file_content, Loader=Loader))
        self.load_workflow(workflow)

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
