import logging

from dharpa.vre.jupyter.base import MessageEnvelope, MessageHandler
from dharpa.vre.types.generated import (
    MsgModuleIOGetInputValues,
    MsgModuleIOInputValuesUpdated,
    MsgModuleIOUpdateInputValues,
)
from dharpa.vre.utils.dataclasses import from_dict

logger = logging.getLogger(__name__)


class ModuleIOHandler(MessageHandler):

    def _handle_GetInputValues(self, msg: MessageEnvelope):
        '''
        Return workflow step input values.
        '''
        message = from_dict(MsgModuleIOGetInputValues, msg.content)
        values = self.context.get_current_workflow_step_input_values(
            message.id)

        self.publisher.publish(MsgModuleIOInputValuesUpdated(
            message.id,
            values
        ))

    def _handle_UpdateInputValues(self, msg: MessageEnvelope):
        message = from_dict(MsgModuleIOUpdateInputValues, msg.content)
        values = self.context.update_current_workflow_step_input_values(
            message.id,
            message.input_values
        )

        self.publisher.publish(MsgModuleIOInputValuesUpdated(
            message.id,
            values
        ))
