import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union, cast

from dharpa.vre.context.context import AppContext, UpdatedIO
from dharpa.vre.types.generated import DataTabularDataFilter, State, TableStats
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


class KiaraAppContext(AppContext, PipelineController):
    _current_workflow: KiaraWorkflow

    def load_workflow(self, workflow_file_or_name: Union[Path, str]) -> None:
        '''
        AppContext
        '''
        assert not isinstance(workflow_file_or_name, Path), \
            'Path is not supported yet'
        kiara: Kiara = Kiara.instance()

        self._current_workflow = kiara.create_workflow(
            workflow_file_or_name, controller=self)

        # TODO: access the pipeline here because it is lazily created
        # in the getter. If not done, any code later accessing pipeline in
        # a different way will fail.
        self._current_workflow.pipeline

        # TODO: kiara does not set default values yet. Temporarily doing it
        # here for all the modules
        self.set_default_values()
        # TODO: executing workflow right away for dev purposes only
        self.execute_all_steps()

    @property
    def current_workflow_structure(self) -> Optional[PipelineStructureDesc]:
        '''
        AppContext
        '''
        return self.get_current_pipeline_state().structure

    def get_step_input_value(
        self,
        step_id: str,
        input_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Tuple[Any, Any]:
        inputs = self.get_current_pipeline_state().step_inputs[step_id]
        if inputs is None:
            return (None, None)

        if input_id not in inputs.values:
            return (None, None)

        value = self.get_step_input(step_id, input_id)

        return get_value_data(value, filter)

    def get_step_output_value(
        self,
        step_id: str,
        output_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Tuple[Any, Any]:
        outputs = self.get_current_pipeline_state().step_outputs[step_id]
        if outputs is None:
            return (None, None)

        if output_id not in outputs.values:
            return (None, None)

        value = self.get_step_output(step_id, output_id)

        return get_value_data(value, filter)

    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict[str, Any]]
    ):
        input_connections = self.get_current_pipeline_state() \
            .structure.steps[step_id].input_connections

        updated_values = {}

        for input_id, value in (input_values or {}).items():
            pipeline_input_id = get_pipeline_input_id(
                input_connections[input_id])
            if pipeline_input_id is not None and value is not None:
                self._current_workflow.inputs[pipeline_input_id] = value
                updated_values[input_id] = value

    def run_processing(self, step_id: Optional[str] = None):
        try:
            self.processing_state_changed.publish(State.BUSY)
            if step_id is not None:
                self.process_step(step_id)
            else:
                self.execute_all_steps()
        finally:
            self.processing_state_changed.publish(State.IDLE)

    def execute_all_steps(self):
        for stage in self.processing_stages:
            for step_id in stage:
                self.process_step(step_id)

    def set_default_values(self):
        inputs = self.get_current_pipeline_state() \
            .pipeline_inputs.values.items()
        default_pipeline_inputs = {
            key: pipeline_value.value_schema.default
            for key, pipeline_value in inputs
            if pipeline_value.value_schema.default is not None
        }
        self.pipeline_inputs = default_pipeline_inputs

    def step_inputs_changed(self, event: "StepInputEvent"):
        '''
        PipelineController
        '''
        for step_id, input_ids in event.updated_step_inputs.items():
            msg = UpdatedIO(step_id=step_id, io_ids=input_ids)
            self.step_input_values_updated.publish(msg)

    def step_outputs_changed(self, event: "StepOutputEvent"):
        '''
        PipelineController
        '''
        for step_id, output_ids in event.updated_step_outputs.items():
            msg = UpdatedIO(step_id=step_id, io_ids=output_ids)
            self.step_output_values_updated.publish(msg)
