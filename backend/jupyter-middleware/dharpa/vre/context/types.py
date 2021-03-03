from typing import Dict, List, Optional
from dataclasses import dataclass


@dataclass
class WorkflowStructureStep:
    id: str  # guid
    module_id: str
    parameters: Optional[Dict]


@dataclass
class WorkflowStructure:
    steps: List[WorkflowStructureStep]


@dataclass
class Workflow:
    id: str  # guid
    label: str
    structure: WorkflowStructure
