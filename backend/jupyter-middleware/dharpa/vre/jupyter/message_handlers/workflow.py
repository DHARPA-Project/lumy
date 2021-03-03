from dataclasses import asdict, dataclass
import logging
from typing import Optional

from dharpa.vre.context.context import AppContext
from dharpa.vre.context.types import Workflow
from dharpa.vre.jupyter.base import MessageEnvelope, Target, TargetPublisher

logger = logging.getLogger(__name__)


@dataclass
class MessageWorkflowUpdated:
    workflow: Optional[Workflow] = None


class WorkflowMessageHandler:
    _context: AppContext
    _publisher: TargetPublisher

    def __init__(self, context: AppContext, publisher: TargetPublisher):
        self._context = context
        self._publisher = publisher

    def handle_message(self, msg: MessageEnvelope):
        handler = getattr(self, f'_handle_{msg.action}', None)
        if handler:
            return handler(msg)
        else:
            logger.warn(f'Unknown message type received: {msg.action}')

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return current workflow.
        '''
        self._publisher.publish(
            Target.Workflow,
            MessageEnvelope(
                action='updated',
                content=asdict(
                    MessageWorkflowUpdated(self._context.current_workflow))
            ))
