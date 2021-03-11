# flake8: noqa
from enum import Enum
from dataclasses import dataclass
from typing import Optional, List, Any, Dict


class State(Enum):
    """Current state."""
    BUSY = "busy"
    IDLE = "idle"


@dataclass
class MsgExecutionState:
    """Announces current state of the backend. Useful for letting the user know if they need to
    wait.
    """
    """Current state."""
    state: State


@dataclass
class MsgModuleIOExecute:
    """Run this step with the latest used parameters on all data (not preview only)."""
    """Unique ID of the step within the workflow."""
    id: str


@dataclass
class MsgProgress:
    """Announces progress of current operation to the frontend."""
    """Progress in percents."""
    progress: float


@dataclass
class MsgError:
    """Indicates that an error occured and contains error details."""
    """Unique ID of the error, for traceability."""
    id: str
    """User friendly error message."""
    message: str
    """A less user friendly error message. Optional."""
    extended_message: Optional[str] = None


@dataclass
class MsgModuleIOOutputUpdated:
    """Contains output data of a step from the current workflow after it was recalculated."""
    """Unique ID of the step within the workflow."""
    id: str
    """Output data for the module"""
    outputs: List[Any]


@dataclass
class MsgParametersGet:
    """Get parameters of a step from the current workflow."""
    """Unique ID of the step within the workflow that we are getting parameters for."""
    id: str


@dataclass
class MsgModuleIOPreviewGet:
    """Get preview of I/O data of a step from the current workflow."""
    """Unique ID of the step within the workflow that we are getting preview for."""
    id: str


@dataclass
class MsgModuleIOPreviewUpdated:
    """Contains preview of I/O data of a step from the current workflow."""
    """Unique ID of the step within the workflow that the preview is for."""
    id: str
    """Input data for the module"""
    inputs: List[Any]
    """Output data for the module"""
    outputs: List[Any]


@dataclass
class MsgModuleIOPreviewParametersUpdate:
    """Update preview parameters (or preview filters) for the current workflow."""
    """Size of the preview"""
    size: Optional[int] = None


@dataclass
class MsgParametersUpdated:
    """Updated parameters of a step in the current workflow."""
    """Unique ID of the step within the workflow."""
    id: str
    """Optional parameters of the step."""
    parameters: Optional[Dict[str, Any]] = None


@dataclass
class MsgParametersUpdate:
    """Update parameters of a step in the current workflow."""
    """Unique ID of the step within the workflow."""
    id: str
    """Optional parameters of the step that we are setting."""
    parameters: Optional[Dict[str, Any]] = None


@dataclass
class WorkflowStep:
    """A single Workflow step."""
    """Unique ID of the step within the workflow."""
    id: str
    """ID of the module that is used in this step."""
    module_id: str
    """Optional parameters of the module that are applied in this step."""
    parameters: Optional[Dict[str, Any]] = None


@dataclass
class WorkflowStructure:
    """Modular structure of the workflow.
    
    Workflow structure. Contains all modules that are a part of the workflow.
    """
    """Steps of the workflow."""
    steps: List[WorkflowStep]


@dataclass
class Workflow:
    """Represents a workflow.
    
    Current workflow.
    """
    """Unique ID of the workflow."""
    id: str
    """Human readable name of the workflow."""
    label: str
    """Modular structure of the workflow."""
    structure: WorkflowStructure


@dataclass
class MsgWorkflowUpdated:
    """Contains current workflow."""
    """Current workflow."""
    workflow: Optional[Workflow] = None


@dataclass
class MsgParametersSnapshotList:
    """List of snapshots for a step from the current workflow."""
    """List of snapshots."""
    snapshots: List[Any]
    """Unique ID of the step within the workflow."""
    step_id: str


@dataclass
class MsgParametersSnapshotCreate:
    """Create snapshot of parameters of a step from the current workflow."""
    """Optional parameters of the step."""
    parameters: Dict[str, Any]
    """Unique ID of the step within the workflow."""
    step_id: str
