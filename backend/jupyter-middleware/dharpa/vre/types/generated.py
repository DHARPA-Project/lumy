# flake8: noqa
from dataclasses import dataclass
from typing import Optional, List, Any, Dict, Union
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
class MsgModuleIOGetInputValues:
    """Target: "moduleIO"
    Message type: "GetInputValues"
    
    Get values of inputs of a step from the current workflow.
    """
    """Unique ID of the step within the workflow that we are getting parameters for."""
    id: str
    """Limit returned values only to inputs with these IDs."""
    input_ids: Optional[List[Any]] = None


@dataclass
class MsgModuleIOGetPreview:
    """Target: "moduleIO"
    Message type: "GetPreview"
    
    Get preview of I/O data of a step from the current workflow.
    """
    """Unique ID of the step within the workflow that we are getting preview for."""
    id: str


@dataclass
class DataTabularDataFilter:
    """Filter for tabular data"""
    """Size of the page"""
    page_size: int
    """Offset of the page"""
    offset: Optional[int] = None


@dataclass
class MsgModuleIOGetTabularInputValue:
    """Target: "moduleIO"
    Message type: "GetTabularInputValue"
    
    Get a filtered version of a tabular input of a step from the current workflow.
    """
    filter: DataTabularDataFilter
    """Unique ID of the step within the workflow that we are getting parameters for."""
    id: str
    """Unique ID of the input"""
    input_id: str


@dataclass
class MsgModuleIOInputValuesUpdated:
    """Target: "moduleIO"
    Message type: "InputValuesUpdated"
    
    Updated input values of a step in the current workflow.
    TODO: At the moment only those values that are not outputs of other modules (hence the
    ones used in the UI).
    """
    """Unique ID of the step within the workflow."""
    id: str
    """Input values."""
    input_values: Optional[Dict[str, Any]] = None


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
    """Input data of the module. Key is input Id."""
    inputs: Dict[str, Any]
    """Output data of the module. Key is input Id."""
    outputs: Dict[str, Any]


@dataclass
class MsgModuleIOTabularInputValueUpdated:
    """Target: "moduleIO"
    Message type: "TabularInputValueUpdated"
    
    A filtered version of a tabular input of a step from the current workflow.
    """
    filter: DataTabularDataFilter
    """Unique ID of the step within the workflow that we are getting parameters for."""
    id: str
    """Unique ID of the input"""
    input_id: str
    """The actual value payload. TODO: The type will be set later"""
    value: Union[Dict[str, Any], None, str]


@dataclass
class MsgModuleIOUpdateInputValues:
    """Target: "moduleIO"
    Message type: "UpdateInputValues"
    
    Update input values of a step in the current workflow.
    TODO: At the moment only those values that are not outputs of other modules (hence the
    ones used in the UI).
    """
    """Unique ID of the step within the workflow."""
    id: str
    """Input values."""
    input_values: Optional[Dict[str, Any]] = None


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
class IOStateConnection:
    """Incoming or outgoing connection of a module"""
    """ID of the input or output"""
    io_id: str
    """ID of the step"""
    step_id: str


@dataclass
class WorkflowIOState:
    """State of a single input or output."""
    """Optional default value"""
    default_value: Union[List[Any], bool, float, int, Dict[str, Any], None, str]
    connection: Optional[IOStateConnection] = None
    """Indicates whether the value is tabular. This field will likely be gone in real backend."""
    is_tabular: Optional[bool] = None


@dataclass
class WorkflowStep:
    """A single Workflow step."""
    """Unique ID of the step within the workflow."""
    id: str
    """State of module inputs of the step. Key is stepId."""
    inputs: Dict[str, WorkflowIOState]
    """ID of the module that is used in this step."""
    module_id: str
    """State of module outputs of the step. Key is stepId."""
    outputs: Dict[str, WorkflowIOState]


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
class MsgWorkflowUpdated:
    """Target: "workflow"
    Message type: "Updated"
    
    Contains current workflow.
    """
    """Current workflow."""
    workflow: Optional[Workflow] = None


class DataType(Enum):
    """Type of the data value."""
    TABLE = "table"


@dataclass
class DataValueContainer:
    """Container for complex data types.
    Basic data types are: string, int, float, bool and lists of these types.
    Everything else requires a container that contains some metadata hinting what the type
    is.
    For some types like 'table' the value is not provided because it may be too big.
    A batch view of the data value should be used to access such values.
    """
    """Type of the data value."""
    data_type: DataType
    """Some statistical numbers describing data.
    The content of this field is type dependent.
    E.g. for 'table' this could contain the actual number of rows.
    """
    stats: Optional[Dict[str, Any]] = None
    """Actual value. This may be provided (e.g. Date) or may not be provided (e.g. Table)"""
    value: Optional[str] = None
