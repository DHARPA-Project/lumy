from pathlib import Path
from typing import TYPE_CHECKING, Dict, List, Optional, Union

from dharpa.vre.context.context import AppContext
from dharpa.vre.types.generated import DataTabularDataFilter
from kiara import Kiara, PipelineController
from kiara.pipeline.structure import PipelineStructureDesc
from kiara.workflow import KiaraWorkflow
import logging

if TYPE_CHECKING:
    from kiara.events import StepInputEvent, StepOutputEvent
    from pyarrow import Table

logger = logging.getLogger(__name__)


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
        # TODO: kiara is a bit broken and won't work without the
        # code below. Will be removed once fixed.
        try:
            self.set_pipeline(self._current_workflow.pipeline)
        except Exception as e:
            logger.info(f'cannot set pipeline: {str(e)}')

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
        pass

    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict]
    ) -> Optional[Dict]:
        '''
        AppContext
        '''
        pass

    def get_step_tabular_input_value(
        self,
        step_id: str,
        input_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Optional['Table']:
        '''
        AppContext
        '''
        pass

    def is_tabular_input(self, step_id: str, input_id: str) -> bool:
        '''
        AppContext
        '''
        raise Exception('Not implemented')

    def run_processing(self, step_id: Optional[str] = None):
        '''
        AppContext
        '''
        pass

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
