import importlib.resources as pkg_resources
from typing import Dict, Optional, Callable
from dharpa.vre.utils.dataclasses import from_yaml
from tinypubsub.simple import SimplePublisher

from dharpa.vre.context.context import AppContext
from dharpa.vre.types import Workflow, WorkflowStructure
from dharpa.vre.context.mock import resources

WorkflowStructureUpdated = Callable[[WorkflowStructure], None]


class MockAppContext(AppContext):
    _current_workflow: Optional[Workflow] = None
    _steps_input_values: Dict[str, Optional[Dict]] = {}
    _steps_output_values: Dict[str, Optional[Dict]] = {}

    _event_workflow_structure_updated = SimplePublisher[WorkflowStructure]()

    def __init__(self):
        workflow_file_content = pkg_resources.open_text(
            resources, 'sample_workflow_1.yml')
        workflow = from_yaml(Workflow, workflow_file_content)
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

    def get_current_workflow_step_input_values(
        self,
        step_id: str
    ) -> Optional[Dict]:
        values = self._steps_input_values[step_id] \
            if step_id in self._steps_input_values else None
        if values is None and self._current_workflow is not None:
            step = next((
                x
                for x in self._current_workflow.structure.steps
                if x.id == step_id
            ), None)
            values = {
                input_id: state.default_value for input_id,
                state in step.inputs.items()
                if state.default_value is not None
            }
            self._steps_input_values[step_id] = values
        return values

    def update_current_workflow_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict]
    ) -> Optional[Dict]:
        self._steps_input_values[step_id] = input_values
        # TODO: processing here ?
        return input_values
