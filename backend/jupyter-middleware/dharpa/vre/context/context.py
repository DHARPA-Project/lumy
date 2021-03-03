from abc import ABC, abstractmethod
from typing import Dict, Optional
from tinypubsub.simple import SimplePublisher

from dharpa.vre.context.types import Workflow, WorkflowStructure


class AppContext(ABC):
    @abstractmethod
    def load_workflow(self, workflow: Workflow) -> None:
        ...

    @property
    @abstractmethod
    def workflow_structure_updated(self) -> SimplePublisher[WorkflowStructure]:
        ...

    @property
    @abstractmethod
    def current_workflow(self) -> Optional[Workflow]:
        ...

    @abstractmethod
    def get_current_workflow_step_parameters(
        self,
        step_id: str
    ) -> Optional[Dict]:
        ...

    def update_current_workflow_step_parameters(
        self,
        step_id: str,
        parameters: Optional[Dict]
    ) -> Optional[Dict]:
        ...
