# flake8: noqa
from dataclasses import dataclass
from typing import Optional, List, Any, Dict
from enum import Enum


@dataclass
class MsgError:
    """Target: "activity"
    Message type: "Error"
    
    Indicates that an error occured and contains error details.
    """
    """Unique ID of the error, for traceability."""
    id: str
    """User friendly error message."""
    message: str
    """A less user friendly error message. Optional."""
    extended_message: Optional[str] = None


class State(Enum):
    """Current state."""
    BUSY = "busy"
    IDLE = "idle"


@dataclass
class MsgExecutionState:
    """Target: "activity"
    Message type: "ExecutionState"
    
    Announces current state of the backend. Useful for letting the user know if they need to
    wait.
    """
    """Current state."""
    state: State


@dataclass
class MsgProgress:
    """Target: "activity"
    Message type: "Progress"
    
    Announces progress of current operation to the frontend.
    """
    """Progress in percents."""
    progress: float


@dataclass
class MsgDataRepositoryCreateSubset:
    """Target: "dataRepository"
    Message type: "CreateSubset"
    
    Request to create a subset of items
    """
    """List of items IDs to add to the subset"""
    items_ids: List[str]
    """Label of the subset"""
    label: str


@dataclass
class DataRepositoryItemsFilter:
    """Filter to apply to items"""
    """Start from item"""
    page_offset: Optional[int] = None
    """Number of items to return"""
    page_size: Optional[int] = None


@dataclass
class MsgDataRepositoryFindItems:
    """Target: "dataRepository"
    Message type: "FindItems"
    
    Request to find items in data repository
    """
    filter: Optional[DataRepositoryItemsFilter] = None


@dataclass
class MsgDataRepositoryGetItemPreview:
    """Target: "dataRepository"
    Message type: "GetItemPreview"
    
    Item preview
    """
    """Item ID"""
    id: str


@dataclass
class DataRepositoryItem:
    """Item from data repository"""
    """Unique ID of the item"""
    id: str


@dataclass
class MsgDataRepositoryItemPreview:
    """Target: "dataRepository"
    Message type: "ItemPreview"
    
    Item preview
    """
    item: DataRepositoryItem


@dataclass
class MsgDataRepositoryItems:
    """Target: "dataRepository"
    Message type: "Items"
    
    Items from data repository
    """
    items: List[DataRepositoryItem]
    filter: Optional[DataRepositoryItemsFilter] = None


@dataclass
class MsgDataRepositorySubset:
    """Target: "dataRepository"
    Message type: "Subset"
    
    A subset of items
    """
    """Unique ID of the subset"""
    id: str
    """List of items IDs to add to the subset"""
    items_ids: List[str]
    """Label of the subset"""
    label: str


@dataclass
class MsgModuleIOExecute:
    """Target: "moduleIO"
    Message type: "Execute"
    
    Run this step with the latest used parameters on all data (not preview only).
    """
    """Unique ID of the step within the workflow."""
    id: str


@dataclass
class MsgModuleIOGetPreview:
    """Target: "moduleIO"
    Message type: "GetPreview"
    
    Get preview of I/O data of a step from the current workflow.
    """
    """Unique ID of the step within the workflow that we are getting preview for."""
    id: str


@dataclass
class MsgModuleIOOutputUpdated:
    """Target: "moduleIO"
    Message type: "OutputUpdated"
    
    Contains output data of a step from the current workflow after it was recalculated.
    """
    """Unique ID of the step within the workflow."""
    id: str
    """Output data for the module"""
    outputs: List[Any]


@dataclass
class MsgModuleIOPreviewUpdated:
    """Target: "moduleIO"
    Message type: "PreviewUpdated"
    
    Contains preview of I/O data of a step from the current workflow.
    """
    """Unique ID of the step within the workflow that the preview is for."""
    id: str
    """Input data for the module"""
    inputs: List[Any]
    """Output data for the module"""
    outputs: List[Any]


@dataclass
class MsgModuleIOUpdatePreviewParameters:
    """Target: "moduleIO"
    Message type: "UpdatePreviewParameters"
    
    Update preview parameters (or preview filters) for the current workflow.
    """
    """Size of the preview"""
    size: Optional[int] = None


@dataclass
class Note:
    """Represents a step note."""
    """Textual content of the note."""
    content: str
    """Unique ID of the note."""
    id: str


@dataclass
class MsgNotesAdd:
    """Target: "notes"
    Message type: "Add"
    
    Add a note for a workflow step.
    """
    note: Note
    """Workflow step Id."""
    step_id: str


@dataclass
class MsgNotesGetNotes:
    """Target: "notes"
    Message type: "GetNotes"
    
    Get list of notes for a workflow step.
    """
    """Workflow step Id."""
    step_id: str


@dataclass
class MsgNotesNotes:
    """Target: "notes"
    Message type: "Notes"
    
    Contains list of notes for a workflow step.
    """
    notes: List[Note]
    """Workflow step Id."""
    step_id: str


@dataclass
class MsgParametersCreateSnapshot:
    """Target: "parameters"
    Message type: "CreateSnapshot"
    
    Create snapshot of parameters of a step from the current workflow.
    """
    """Optional parameters of the step."""
    parameters: Dict[str, Any]
    """Unique ID of the step within the workflow."""
    step_id: str


@dataclass
class MsgParametersGet:
    """Target: "parameters"
    Message type: "Get"
    
    Get parameters of a step from the current workflow.
    """
    """Unique ID of the step within the workflow that we are getting parameters for."""
    id: str


@dataclass
class MsgParametersSnapshots:
    """Target: "parameters"
    Message type: "Snapshots"
    
    List of snapshots for a step from the current workflow.
    """
    """List of snapshots."""
    snapshots: List[Any]
    """Unique ID of the step within the workflow."""
    step_id: str


@dataclass
class MsgParametersUpdate:
    """Target: "parameters"
    Message type: "Update"
    
    Update parameters of a step in the current workflow.
    """
    """Unique ID of the step within the workflow."""
    id: str
    """Optional parameters of the step that we are setting."""
    parameters: Optional[Dict[str, Any]] = None


@dataclass
class MsgParametersUpdated:
    """Target: "parameters"
    Message type: "Updated"
    
    Updated parameters of a step in the current workflow.
    """
    """Unique ID of the step within the workflow."""
    id: str
    """Optional parameters of the step."""
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
    """Current workflow.
    
    Represents a workflow.
    """
    """Unique ID of the workflow."""
    id: str
    """Human readable name of the workflow."""
    label: str
    """Modular structure of the workflow."""
    structure: WorkflowStructure


@dataclass
class MsgWorkflowWorkflowUpdated:
    """Target: "workflow"
    Message type: "MsgWorkflowUpdated"
    
    Contains current workflow.
    """
    """Current workflow."""
    workflow: Optional[Workflow] = None
