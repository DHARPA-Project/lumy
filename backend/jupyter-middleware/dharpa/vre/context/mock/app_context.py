import dataclasses
import importlib.resources as pkg_resources
from collections import defaultdict
from pathlib import Path
from typing import TYPE_CHECKING, Any, Callable, Dict, List, Optional

from dharpa.vre.context.context import AppContext
from dharpa.vre.context.mock import resources
from dharpa.vre.types import Workflow, WorkflowStructure
from dharpa.vre.types.generated import DataTabularDataFilter, WorkflowStep
from dharpa.vre.utils.dataclasses import from_yaml
from dharpa.vre.modules import get_module_processor
from stringcase import snakecase

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

    def _get_step(self, step_id: str) -> Optional[WorkflowStep]:
        return next((
            x
            for x in self._current_workflow.structure.steps
            if x.id == step_id
        ), None)

    def _process_step(self, step_id: str) -> None:
        step = self._get_step(step_id)
        if step is None:
            return

        fn = get_module_processor(step.module_id)
        if fn is not None:
            inputs = self.get_step_input_values(step_id)
            if inputs is not None:
                inputs_keys = list(step.inputs.keys())
                inputs_cls = dataclasses.make_dataclass(
                    'Inputs', inputs_keys)
                inputs = inputs_cls(**{k: inputs.get(k, None)
                                       for k in inputs_keys})

            outputs = self._get_step_output_values(step_id)
            if outputs is not None:
                outputs_keys = list(step.outputs.keys())
                outputs_cls = dataclasses.make_dataclass(
                    'Outputs', outputs_keys)
                outputs = outputs_cls(
                    **{k: outputs.get(k, None) for k in outputs_keys})

            if inputs is not None and outputs is not None:
                fn(inputs, outputs)

                items = dataclasses.asdict(outputs).items()
                for output_id, output_value in items:
                    io = step.outputs.get(output_id)
                    if io is not None and io.connection is not None:
                        conn_step_id = io.connection.step_id
                        conn_input_id = snakecase(io.connection.io_id)
                        self._steps_input_values[
                            conn_step_id][conn_input_id] = output_value
                    else:
                        self._steps_output_values[step_id][output_id] = \
                            output_value

    def _process_all_steps(self) -> None:
        for s in self._current_workflow.structure.steps:
            self._process_step(s.id)

    def get_step_input_values(
        self,
        step_id: str,
        input_ids: Optional[List[str]] = None
    ) -> Optional[Dict]:
        step = self._get_step(step_id)
        if step is None:
            return None

        def get_value(input_id):
            if input_id in self._steps_input_values[step_id]:
                return self._steps_input_values[step_id][input_id]
            else:
                i = step.inputs.get(input_id, None)
                # if i is not None and i.connection is not None:
                if i is not None and i.default_value is not None:
                    return i.default_value
            return None

        returned_inputs_ids = input_ids or list(step.inputs.keys())
        values = {
            i: get_value(i)
            for i in returned_inputs_ids
        }

        return {k: v for k, v in values.items() if v is not None}

    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict]
    ) -> Optional[Dict]:
        for k, v in (input_values or {}).items():
            self._steps_input_values[step_id][k] = v
        self._process_all_steps()
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
        else:
            self._steps_inputs_tabular_filters[step_id][input_id] = filter

        return table.slice(filter.offset, filter.page_size)

    def is_tabular_input(self, step_id: str, input_id: str) -> bool:
        if self._current_workflow is None:
            return False

        step = self._get_step(step_id)

        if input_id in step.inputs:
            return step.inputs[input_id].is_tabular or False
        return True

    def get_step_tabular_input_filter(
        self,
        step_id: str,
        input_id: str
    ) -> DataTabularDataFilter:
        return self._steps_inputs_tabular_filters[step_id].get(
            input_id,
            DEFAULT_TABULAR_FILTER
        )

    def _get_step_output_values(
        self,
        step_id: str,
        output_ids: Optional[List[str]] = None
    ) -> Optional[Dict]:
        step = self._get_step(step_id)
        if step is None:
            return None

        def get_value(output_id):
            if output_id in self._steps_output_values[step_id]:
                return self._steps_output_values[step_id][output_id]
            else:
                io = step.outputs.get(output_id)
                if io is not None and io.connection is not None:
                    connection_step_id = io.connection.step_id
                    connection_input_id = snakecase(io.connection.io_id)
                    v = self._steps_input_values[connection_step_id].get(
                        connection_input_id, None)
                    if v is not None:
                        return v
                elif io is not None and io.default_value is not None:
                    return io.default_value
            return None

        returned_outputs_ids = output_ids or list(step.outputs.keys())
        values = {
            i: get_value(i)
            for i in returned_outputs_ids
        }

        return {k: v for k, v in values.items() if v is not None}
