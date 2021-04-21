import logging
from typing import cast, Dict, Any
from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types import MsgWorkflowUpdated

logger = logging.getLogger(__name__)


class WorkflowMessageHandler(MessageHandler):

    def _handle_GetCurrent(self):
        '''
        Return current workflow.
        '''
        self.publisher.publish(MsgWorkflowUpdated(
            cast(Dict[str, Any], self._context.current_workflow)
        ))
