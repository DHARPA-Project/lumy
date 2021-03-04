from dataclasses import dataclass
from typing import Dict, Optional

from dharpa.vre.context.types import Workflow


@dataclass
class ParametersGet:
    module_id: str


@dataclass
class ParametersUpdate:
    module_id: str
    parameters: Optional[Dict] = None


@dataclass
class ParametersUpdated:
    module_id: str
    parameters: Optional[Dict] = None


@dataclass
class WorkflowUpdated:
    workflow: Optional[Workflow] = None
