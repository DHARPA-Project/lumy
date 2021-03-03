from dataclasses import asdict, dataclass
import logging
from typing import Optional

from dharpa.vre.context.types import Workflow
from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target

logger = logging.getLogger(__name__)


@dataclass
class MessageWorkflowUpdated:
    workflow: Optional[Workflow] = None


class WorkflowMessageHandler(MessageHandler):

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return current workflow.
        '''
        self.publisher.publish(
            Target.Workflow,
            MessageEnvelope(
                action='updated',
                content=asdict(
                    MessageWorkflowUpdated(self._context.current_workflow))
            ))
