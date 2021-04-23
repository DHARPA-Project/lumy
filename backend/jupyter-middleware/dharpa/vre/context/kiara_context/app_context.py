import logging
from pathlib import Path
from typing import TYPE_CHECKING, Dict, List, Optional, Union, cast

from dharpa.vre.context.context import AppContext
from dharpa.vre.types.generated import DataTabularDataFilter
from kiara import Kiara, PipelineController
from kiara.data.types import ValueType
from kiara.data.values import DataValue, Value
from kiara.pipeline.structure import PipelineStructureDesc
from kiara.workflow import KiaraWorkflow

if TYPE_CHECKING:
    from kiara.events import StepInputEvent, StepOutputEvent
    from pyarrow import Table

logger = logging.getLogger(__name__)


def get_value_data(value: Value):
    if not hasattr(value, 'get_value_data'):
        raise Exception(
            f'Don\'t know how value from class "{value.__class__}"')
    return cast(DataValue, value).get_value_data()


def get_pipeline_input_id(ids: List[str]) -> Optional[str]:
    for id in ids:
        parts = id.split('.')

        if parts[0] == '__pipeline__':
            return parts[1]


class KiaraAppContext(AppContext, PipelineController):
    _current_workflow: KiaraWorkflow

    def __init__(self):
        PipelineController.__init__(self, None)
        AppContext.__init__(self)

    def load_workflow(self, workflow_file_or_name: Union[Path, str]) -> None:
        '''
        AppContext
        '''
        assert not isinstance(workflow_file_or_name, Path), \
            'Path is not supported yet'
        kiara: Kiara = Kiara.instance()
        self._current_workflow = kiara.create_workflow(
            workflow_file_or_name, controller=self)
        # TODO: kiara is a bit broken and won't work without the
        # code below. Will be removed once fixed.
        try:
            self.set_pipeline(self._current_workflow.pipeline)
        except Exception as e:
            logger.info(f'cannot set pipeline: {str(e)}')
        # TODO: executing workflow right away for testing only
        self.set_default_values()
        self.execute_all_steps()

    @property
    def current_workflow_structure(self) -> Optional[PipelineStructureDesc]:
        '''
        AppContext
        '''
        return self.get_current_pipeline_state().structure

    def get_step_input_values(
        self,
        step_id: str,
        input_ids: Optional[List[str]] = None,
        include_tabular: Optional[bool] = None
    ) -> Optional[Dict]:
        '''
        AppContext
        '''
        inputs = self.get_current_pipeline_state().step_inputs[step_id]
        if inputs is None:
            return

        all_input_ids = inputs.values.keys()
        if input_ids is not None:
            actual_input_ids = [
                id
                for id in input_ids
                if id in all_input_ids
            ]
        else:
            actual_input_ids = all_input_ids

        values = {
            id: self.get_step_input(step_id, id)
            for id in actual_input_ids
        }

        return {
            k: get_value_data(v)
            for k, v in values.items()
            if include_tabular or not self.is_tabular_input(step_id, k)
        }

    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict]
    ) -> Optional[Dict]:
        '''
        AppContext
        '''
        input_connections = self.get_current_pipeline_state() \
            .structure.steps[step_id].input_connections

        for input_id, value in (input_values or {}).items():
            pipeline_input_id = get_pipeline_input_id(
                input_connections[input_id])
            if pipeline_input_id is not None and value is not None:
                self._current_workflow.inputs[pipeline_input_id] = value

    def get_step_tabular_input_value(
        self,
        step_id: str,
        input_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Optional['Table']:
        '''
        AppContext
        '''
        if not self.is_tabular_input(step_id, input_id):
            return None

        table = get_value_data(self.get_step_input(step_id, input_id))
        if table is None:
            return

        if filter:
            return table.slice(filter.offset or 0, filter.page_size)
        else:
            return table

    def is_tabular_input(self, step_id: str, input_id: str) -> bool:
        '''
        AppContext
        '''
        # TODO: getting original input types from the module
        # because getting correct types from current structure
        # is not fully implemented in kiara yet

        step = self.get_current_pipeline_state().structure.steps[step_id].step
        input_schemas = step.module.input_schemas
        return input_schemas[input_id].type == ValueType.table.value

    def run_processing(self, step_id: Optional[str] = None):
        '''
        AppContext
        '''
        if step_id is not None:
            self.process_step(step_id)
        else:
            self.execute_all_steps()

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
