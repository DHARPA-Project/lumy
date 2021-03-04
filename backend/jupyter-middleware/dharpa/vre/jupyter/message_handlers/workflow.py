from dataclasses import dataclass
import logging
from typing import Optional

from dharpa.vre.context.types import Workflow
from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.utils.dataclasses import to_dict

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
                content=to_dict(
                    MessageWorkflowUpdated(self._context.current_workflow))
            ))
