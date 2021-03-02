from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict
from enum import Enum


@dataclass
class MessageEnvelope:
    type: str
    content: Dict


class Target(Enum):
    Workflow = 'workflow'
    ModuleParameters = 'module_parameters'
    ModuleIOPreview = 'module_io_preview'


class TargetPublisher(ABC):
    @abstractmethod
    def publish(self, target: Target, msg: MessageEnvelope) -> None:
        ...
