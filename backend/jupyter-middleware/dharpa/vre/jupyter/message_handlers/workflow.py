from dataclasses import asdict, dataclass
import logging
from typing import Optional

from dharpa.vre.context.context import AppContext
from dharpa.vre.context.types import WorkflowStructure
from dharpa.vre.jupyter.base import MessageEnvelope, Target, TargetPublisher

logger = logging.getLogger(__name__)


@dataclass
class MessageCurrentWorkflowStructure:
    workflow_structure: Optional[WorkflowStructure] = None


class WorkflowMessageHandler:
    _context: AppContext
    _publisher: TargetPublisher

    def __init__(self, context: AppContext, publisher: TargetPublisher):
        self._context = context
        self._publisher = publisher

    def handle_message(self, msg: MessageEnvelope):
        if msg.type == 'get':
            current_structure = self._context.current_workflow.structure \
                if self._context.current_workflow is not None else None
            self._publisher.publish(Target.Workflow, MessageEnvelope(
                type='updated',
                content=asdict(
                    MessageCurrentWorkflowStructure(current_structure))
            ))
        else:
            logger.warn(f'Unknown message type received: {msg.type}')
