import logging

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler, Target
from dharpa.vre.messages import WorkflowUpdated
from dharpa.vre.utils.dataclasses import to_dict

logger = logging.getLogger(__name__)


class WorkflowMessageHandler(MessageHandler):

    def _handle_get(self, msg: MessageEnvelope):
        '''
        Return current workflow.
        '''
        self.publisher.publish(
            Target.Workflow,
            MessageEnvelope(
                action='updated',
                content=to_dict(WorkflowUpdated(
                    self._context.current_workflow
                ))
            ))
