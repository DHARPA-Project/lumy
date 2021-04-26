import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union, cast

from dharpa.vre.context.context import AppContext
from dharpa.vre.types.generated import DataTabularDataFilter, TableStats
from pyarrow import Table

from kiara import Kiara, PipelineController
from kiara.data.values import DataValue, Value
from kiara.pipeline.structure import PipelineStructureDesc
from kiara.workflow import KiaraWorkflow

if TYPE_CHECKING:
    from kiara.events import StepInputEvent, StepOutputEvent

logger = logging.getLogger(__name__)


def get_value_data(
    value: Value,
    filter: Optional[DataTabularDataFilter]
) -> Tuple[Any, Any]:
    if not hasattr(value, 'get_value_data'):
        raise Exception(
            f'Don\'t know how to get value from class "{value.__class__}"')
    actual_value = cast(DataValue, value).get_value_data()

    # TODO: Type metadata is not in fully implemented in kiara yet
    # When it is, replace isinstance check with metadata type check
    if isinstance(actual_value, Table):
        table: Table = actual_value
        table_stats = TableStats(rows_count=table.num_rows)
        if filter is not None:
            if filter.full_value:
                return (table, table_stats)
            else:
                offset = filter.offset or 0
                page_size = filter.page_size or 5
                filtered_table = table.slice(offset, page_size)
                return (filtered_table, table_stats)
        return (None, table_stats)
    return (actual_value, None)


def get_pipeline_input_id(ids: List[str]) -> Optional[str]:
    for id in ids:
        parts = id.split('.')

        if parts[0] == '__pipeline__':
            return parts[1]


class VREPipelineController(PipelineController):
    def __init__(self):
        super().__init__(pipeline=None)

    def step_inputs_changed(self, event: "StepInputEvent"):
        '''
        PipelineController
        '''
        pass

    def step_outputs_changed(self, event: "StepOutputEvent"):
        '''
        PipelineController
        '''
        pass


class KiaraAppContext(AppContext):
    _current_workflow: KiaraWorkflow
    _pipeline_controller: VREPipelineController

    def load_workflow(self, workflow_file_or_name: Union[Path, str]) -> None:
        '''
        AppContext
        '''
        assert not isinstance(workflow_file_or_name, Path), \
            'Path is not supported yet'
        kiara: Kiara = Kiara.instance()

        controller = VREPipelineController()

        self._current_workflow = kiara.create_workflow(
            workflow_file_or_name, controller=controller)
        self._pipeline_controller = controller
        # TODO: access the pipeline here because it is lazily created
        # in the getter. If not done, any code later accessing pipeline in
        # a different way will fail.
        self._current_workflow.pipeline

        # TODO: executing workflow right away for testing only
        self.set_default_values()
        self.execute_all_steps()

    @property
    def current_workflow_structure(self) -> Optional[PipelineStructureDesc]:
        '''
        AppContext
        '''
        if self._pipeline_controller is None:
            return None

        return self._pipeline_controller.get_current_pipeline_state().structure

    def get_step_input_value(
        self,
        step_id: str,
        input_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Tuple[Any, Any]:
        if self._pipeline_controller is None:
            return (None, None)

        inputs = self._pipeline_controller.get_current_pipeline_state(
        ).step_inputs[step_id]
        if inputs is None:
            return (None, None)

        if input_id not in inputs.values:
            return (None, None)

        value = self._pipeline_controller.get_step_input(step_id, input_id)

        return get_value_data(value, filter)

    def get_step_output_value(
        self,
        step_id: str,
        output_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Tuple[Any, Any]:
        if self._pipeline_controller is None:
            return (None, None)

        outputs = self._pipeline_controller.get_current_pipeline_state(
        ).step_outputs[step_id]
        if outputs is None:
            return (None, None)

        if output_id not in outputs.values:
            return (None, None)

        value = self._pipeline_controller.get_step_output(step_id, output_id)

        return get_value_data(value, filter)

    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict[str, Any]]
    ):
        if self._pipeline_controller is None:
            return

        input_connections = self._pipeline_controller \
            .get_current_pipeline_state() \
            .structure.steps[step_id].input_connections

        updated_values = {}

        for input_id, value in (input_values or {}).items():
            pipeline_input_id = get_pipeline_input_id(
                input_connections[input_id])
            if pipeline_input_id is not None and value is not None:
                self._current_workflow.inputs[pipeline_input_id] = value
                updated_values[input_id] = value

    def run_processing(self, step_id: Optional[str] = None):
        if self._pipeline_controller is None:
            return

        if step_id is not None:
            self._pipeline_controller.process_step(step_id)
        else:
            self.execute_all_steps()

    def execute_all_steps(self):
        if self._pipeline_controller is None:
            return

        for stage in self._pipeline_controller.processing_stages:
            for step_id in stage:
                self._pipeline_controller.process_step(step_id)

    def set_default_values(self):
        if self._pipeline_controller is None:
            return

        inputs = self._pipeline_controller.get_current_pipeline_state() \
            .pipeline_inputs.values.items()
        default_pipeline_inputs = {
            key: pipeline_value.value_schema.default
            for key, pipeline_value in inputs
            if pipeline_value.value_schema.default is not None
        }
        self._pipeline_controller.pipeline_inputs = default_pipeline_inputs
