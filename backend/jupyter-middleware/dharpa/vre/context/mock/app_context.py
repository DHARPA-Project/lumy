import importlib.resources as pkg_resources
from collections import defaultdict
from pathlib import Path
from typing import TYPE_CHECKING, Any, Callable, Dict, List, Optional

from dharpa.vre.context.context import AppContext
from dharpa.vre.context.mock import resources
from dharpa.vre.types import Workflow, WorkflowStructure
from dharpa.vre.types.generated import DataTabularDataFilter
from dharpa.vre.utils.dataclasses import from_yaml

if TYPE_CHECKING:
    from pyarrow import Table

WorkflowStructureUpdated = Callable[[WorkflowStructure], None]

DEFAULT_TABULAR_FILTER = DataTabularDataFilter(
    offset=0,
    page_size=5
)


class MockAppContext(AppContext):
    _current_workflow: Optional[Workflow] = None

    # steps i/o values: step_id -> { io_id -> value (if exists) }
    _steps_input_values: Dict[str, Dict[str, Any]] = defaultdict(dict)
    _steps_output_values: Dict[str, Dict[str, Any]] = defaultdict(dict)

    # tabular i/o filters: step_id -> { io_id -> filter (if exists) }
    _steps_inputs_tabular_filters: Dict[
        str, Dict[str, DataTabularDataFilter]
    ] = defaultdict(dict)

    def __init__(self):
        with pkg_resources.path(resources, 'sample_workflow_1.yml') as path:
            self.load_workflow(path)

    def load_workflow(self, workflow_file: Path) -> None:
        with open(workflow_file, 'r') as f:
            workflow = from_yaml(Workflow, f.read())
            self._current_workflow = workflow
        self.workflow_structure_updated.publish(
            self._current_workflow)

    @property
    def current_workflow(self):
        return self._current_workflow

    def get_step_input_values(
        self,
        step_id: str,
        input_ids: Optional[List[str]] = None
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

    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict]
    ) -> Optional[Dict]:
        self._steps_input_values[step_id] = input_values or {}
        return input_values

    def get_step_tabular_input_value(
        self,
        step_id: str,
        input_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Optional['Table']:
        if self._current_workflow is None:
            return None

        if input_id not in self._steps_input_values[step_id]:
            return None

        table: 'Table' = self._steps_input_values[step_id][input_id]

        if filter is None:
            filter = self._steps_inputs_tabular_filters[step_id].get(
                input_id, DEFAULT_TABULAR_FILTER)

        return table.slice(filter.offset, filter.page_size)

    def is_tabular_input(self, step_id: str, input_id: str) -> bool:
        if self._current_workflow is None:
            return False

        step = next((
            x
            for x in self._current_workflow.structure.steps
            if x.id == step_id
        ), None)

        if input_id in step.inputs:
            return step.inputs[input_id].is_tabular or False
        return True
