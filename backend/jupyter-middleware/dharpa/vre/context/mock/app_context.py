import importlib.resources as pkg_resources
from typing import Dict, Optional, Callable
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
    _steps_parameters: Dict[str, Optional[Dict]] = {}

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

    def get_current_workflow_step_parameters(
        self,
        step_id: str
    ) -> Optional[Dict]:
        parameters = self._steps_parameters[step_id] \
            if step_id in self._steps_parameters else None
        if parameters is None and self._current_workflow is not None:
            step = next((
                x
                for x in self._current_workflow.structure.steps
                if x.id == step_id
            ), None)
            parameters = step.parameters
            self._steps_parameters[step_id] = parameters
        return parameters

    def update_current_workflow_step_parameters(
        self,
        step_id: str,
        parameters: Optional[Dict]
    ) -> Optional[Dict]:
        self._steps_parameters[step_id] = parameters
        # TODO: processing here ?
        return parameters
