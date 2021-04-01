from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Dict, Optional, Any

from dharpa.vre.utils.dataclasses import to_dict
from ..target import Target
import logging

from dharpa.vre.context.context import AppContext

logger = logging.getLogger(__name__)


@dataclass
class MessageEnvelope:
    action: str
    content: Optional[Dict] = None


class TargetPublisher(ABC):
    @abstractmethod
    def publish_on_target(self, target: Target, msg: MessageEnvelope) -> None:
        ...

    def publish(self, message: Any) -> None:
        '''A convenience method that picks action and target
        from the "message" class. See `types.__init__` for more
        details on how metadata is assigned.'''

        action = getattr(message.__class__, '_action', None)
        target = getattr(message.__class__, '_target', None)
        assert action is not None, f'Message of class {message.__class__} \
            does not have "_action" property'
        assert target is not None, f'Message of class {message.__class__} \
            does not have "_target" property'

        self.publish_on_target(
            target,
            MessageEnvelope(
                action=action,
                content=to_dict(message)
            )
        )


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
