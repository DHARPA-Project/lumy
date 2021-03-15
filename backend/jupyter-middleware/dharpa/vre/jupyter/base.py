from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, Optional
from enum import Enum
import logging

from dharpa.vre.context.context import AppContext

logger = logging.getLogger(__name__)


@dataclass
class MessageEnvelope:
    action: str
    content: Optional[Dict] = None


class Target(Enum):
    Activity = 'activity'
    Workflow = 'workflow'
    ModuleIO = 'module_io'


class TargetPublisher(ABC):
    @abstractmethod
    def publish(self, target: Target, msg: MessageEnvelope) -> None:
        ...


class MessageHandler(ABC):
    _context: AppContext
    _publisher: TargetPublisher

    _context: AppContext
    _publisher: TargetPublisher

    def __init__(self, context: AppContext, publisher: TargetPublisher):
        self._context = context
        self._publisher = publisher

    @property
    def publisher(self):
        return self._publisher

    @property
    def context(self):
        return self._context

    def handle_message(self, msg: MessageEnvelope):
        handler = getattr(self, f'_handle_{msg.action}', None)
        if handler:
            return handler(msg)
        else:
            logger.warn(
                f'{self.__class__}: \
                    Unknown message type received: {msg.action}')

    def __call__(self, msg: MessageEnvelope):
        return self.handle_message(msg)
