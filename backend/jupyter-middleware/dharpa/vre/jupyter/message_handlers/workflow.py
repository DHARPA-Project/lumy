import logging

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.types import MsgWorkflowWorkflowUpdated
from dharpa.vre.utils.dataclasses import to_dict

logger = logging.getLogger(__name__)


class WorkflowMessageHandler(MessageHandler):

    def _handle_GetCurrent(self, msg: MessageEnvelope):
        '''
        Return current workflow.
        '''
        self.publisher.publish(
            Target.Workflow,
            MessageEnvelope(
                action='Updated',
                content=to_dict(MsgWorkflowWorkflowUpdated(
                    self._context.current_workflow
                ))
            ))
