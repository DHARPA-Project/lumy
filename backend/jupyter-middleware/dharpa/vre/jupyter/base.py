from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, Optional
from enum import Enum


@dataclass
class MessageEnvelope:
    action: str
    content: Optional[Dict] = None


class Target(Enum):
    Workflow = 'workflow'
    ModuleParameters = 'module_parameters'
    ModuleIOPreview = 'module_io_preview'


class TargetPublisher(ABC):
    @abstractmethod
    def publish(self, target: Target, msg: MessageEnvelope) -> None:
        ...
