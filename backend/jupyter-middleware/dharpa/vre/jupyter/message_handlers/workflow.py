import logging
from typing import Dict, Any
from dharpa.vre.jupyter.base import MessageHandler
from dharpa.vre.types import MsgWorkflowUpdated
from pydantic import BaseModel
from stringcase import camelcase

logger = logging.getLogger(__name__)

# TODO: this will be changed and moved elsewhere


def as_camel_case_dict(model: 'BaseModel') -> Dict[str, Any]:
    original_iter = BaseModel._iter

    def custom_iter(self, *args, **kwargs):
        res = original_iter(self, *args, **kwargs)
        for k, v in res:
            yield camelcase(k), v

    try:
        BaseModel._iter = custom_iter
        return model.dict()
    finally:
        BaseModel._iter = original_iter


class WorkflowMessageHandler(MessageHandler):

    def _handle_GetCurrent(self):
        '''
        Return current workflow.
        '''
        self.publisher.publish(MsgWorkflowUpdated(
            None if self._context.current_workflow_structure is None
            else as_camel_case_dict(self._context.current_workflow_structure)
            # cast(Dict[str, Any], self._context.current_workflow_structure)
        ))
