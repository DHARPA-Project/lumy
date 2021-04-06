from abc import ABC, abstractmethod
from dataclasses import dataclass
from pathlib import Path
from typing import TYPE_CHECKING, Dict, List, Optional

from dharpa.vre.types import Workflow, State
from dharpa.vre.types.generated import DataTabularDataFilter
from tinypubsub.simple import SimplePublisher

if TYPE_CHECKING:
    from pyarrow import Table


@dataclass
class UpdatedIO:
    step_id: str
    io_ids: List[str]


class AppContext(ABC):
    '''
    Application context interface that needs to be implemented for
    a particular backend. There are likely only two backends:
    "kiara" and "mock".
    '''

    _event_workflow_structure_updated = SimplePublisher[Workflow]()
    _event_step_input_values_updated = SimplePublisher[UpdatedIO]()
    _event_processing_state_changed = SimplePublisher[State]()

    @abstractmethod
    def load_workflow(self, workflow_file: Path) -> None:
        '''
        Load workflow and set it as the current workflow.
        A synchronous method which should raise an exception if
        something goes wrong. When the method returns - the workflow
        is ready to use.
        '''
        ...

    @property
    @abstractmethod
    def current_workflow(self) -> Optional[Workflow]:
        '''
        Returns current workflow or `None` if no workflow has been loaded.
        '''
        ...

    @property
    def workflow_structure_updated(self) -> SimplePublisher[Workflow]:
        '''
        Event fired whenever current workflow structure is updated.
        This happens either when the user changes the structure or when
        the workflow is loaded.
        '''
        return self._event_workflow_structure_updated

    @abstractmethod
    def get_step_input_values(
        self,
        step_id: str,
        input_ids: Optional[List[str]] = None,
        include_tabular: Optional[bool] = None
    ) -> Optional[Dict]:
        '''
        Return input values for a step. Optionally return values
        only for requested input ids.

        NOTE: There are 2 types of inputs: simple (scalar) and tabular.
        By default this method handles only simple types. If an input id of a
        tabluar input is requested in `input_ids`, and `include_tabular`
        is not set to `True`, it is simply ignored.
        '''
        ...

    @abstractmethod
    def update_step_input_values(
        self,
        step_id: str,
        input_values: Optional[Dict]
    ) -> Optional[Dict]:
        '''
        Update input values for a step. The values dict may not contain
        all the values to be updated.

        NOTE: There are 2 types of inputs: simple (scalar) and tabular.
        This method handles only simple types. If an input id of a
        tabluar input is provided in `input_values`, it is simply ignored.
        '''
        ...

    @property
    def step_input_values_updated(self) -> SimplePublisher[UpdatedIO]:
        '''
        Event fired when input values have been updated.
        That concerns both simple and tabular types.
        The payload contains only input ids without values.
        '''
        return self._event_step_input_values_updated

    @abstractmethod
    def get_step_tabular_input_value(
        self,
        step_id: str,
        input_id: str,
        filter: Optional[DataTabularDataFilter] = None
    ) -> Optional['Table']:
        '''
        Return value of a tabular input of a step.
        The `filter` argument defines the batch of the input to get.
        The last requested filter value should be stored within
        the context and used to return the same batch if filter is
        not provided.
        '''
        ...

    @abstractmethod
    def is_tabular_input(self, step_id: str, input_id: str) -> bool:
        '''
        Returns `True` if input type is tabular. `False` otherwise.
        '''
        ...

    @abstractmethod
    def get_step_tabular_input_filter(
        self,
        step_id: str,
        input_id: str
    ) -> DataTabularDataFilter:
        '''
        Return current value of the tabular filter for the step input.
        '''
        ...

    @abstractmethod
    def run_processing(self, step_id: Optional[str] = None):
        '''
        Run processing of data through the whole workflow.
        '''
        ...

    @property
    def processing_state_changed(self) -> SimplePublisher[State]:
        '''
        Fired when processing state is changed.
        '''
        return self._event_processing_state_changed
